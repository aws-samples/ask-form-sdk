"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormIntentHandler = void 0;
const ask_sdk_core_1 = require("ask-sdk-core");
const apl_templates_1 = require("./apl-templates");
/*
* This handler is responsible for all the features with respect to the form. This has the logic for the following :
* - find the next required field in the form, to be requested from the user
* - validate the input from the user based on defined condition or list of values.
* - conditional fields based on the value or presence of other slots.
* - navigation through the form like next, go back to the previous field with values.
* - alexa presentation layer with touch support. The touch will take the user to the displayed field.
* - list disambiguation : if a user gave an answer that has multiple matches, Alexa will go through each value matched and ask the user for confirmation.
* - final confirmation on the form before saving.
*/
class FormIntentHandler {
    constructor(form, userHandler) {
        this.form = form;
        this.userHandler = userHandler;
    }
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === this.form.name
            && this.userHandler && this.userHandler.canHandle(handlerInput);
    }
    isCurrent(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const { intentName } = sessionAttributes;
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest' && intentName === this.form.name) ||
            (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent'
                && handlerInput.requestEnvelope.request.token.indexOf(this.form.name) >= 0);
    }
    // tslint:disable-next-line: typedef
    async handle(handlerInput) {
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        const thisIntentName = this.form.name;
        const aplTextListTemplateWithTouch = 'TextListWithTouch';
        // Get the user props
        const user = await this.userHandler.getUser(handlerInput);
        console.log(`Got user: ${JSON.stringify(user)}`);
        // Get the slot number session if it exists
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const { slotName } = sessionAttributes;
        let { slotNumber, slotValues, matches, matchNumber } = sessionAttributes;
        if (!slotValues) {
            slotValues = {};
        }
        let beginning = false;
        if (!slotNumber) {
            beginning = true;
            slotNumber = 0;
        }
        console.log(`slot number: ${slotNumber} name: ${slotName} values: ${JSON.stringify(slotName)}`);
        if (!matchNumber) {
            matchNumber = 0;
            matches = [];
        }
        console.log(`match number: ${matchNumber} matches: ${JSON.stringify(matches)}`);
        let prompt = '';
        let gotoSlot;
        if (slotName && currentIntent.slots) {
            // Get the previous slot and elicit again
            const prevSlot = this.form.slots[slotNumber - 1];
            // Check if we have un matched resolutions
            const resolutions = currentIntent.slots[slotName] && currentIntent.slots[slotName].resolutions;
            if (matches.length === 0 && resolutions && resolutions.resolutionsPerAuthority) {
                for (const res of resolutions.resolutionsPerAuthority) {
                    if (res.status.code === 'ER_SUCCESS_NO_MATCH') {
                        console.log('elicit resolution');
                        return handlerInput.responseBuilder
                            .speak(prevSlot.reprompt)
                            .reprompt(prevSlot.reprompt)
                            .addElicitSlotDirective(slotName)
                            .withSimpleCard(this.form.title, prevSlot.reprompt)
                            .getResponse();
                    }
                    else if (res.status.code === 'ER_SUCCESS_MATCH') {
                        for (const match of res.values) {
                            if (match.value && match.value.name) {
                                // Should we use id or name here?
                                matches.push(match.value.id);
                            }
                        }
                        // Add matches to session
                        sessionAttributes.matches = matches;
                    }
                }
            }
            // Get the confirmed status
            const confirmationStatus = currentIntent.slots[slotName] && currentIntent.slots[slotName].confirmationStatus;
            if (matchNumber && confirmationStatus === 'CONFIRMED') {
                // Increment the match and redirect
                const value = matches[matchNumber - 1];
                console.log(`Confirmed slot ${slotName} match ${matchNumber} as ${value}`);
                slotValues[slotName] = value;
                // Clear any matches that we had open
                this.clearMatches(sessionAttributes);
            }
            else if (matches.length > 0 && matchNumber < matches.length) {
                // Save the possible matches in session
                const value = matches[matchNumber];
                // Pass the option to confirmation if we have an options list, else pass value
                console.log(`match number: ${matchNumber}, matches: ${JSON.stringify(matches)}, options: ${JSON.stringify(prevSlot.options)}`);
                const option = prevSlot.options && prevSlot.options[matches[matchNumber]][0] || value;
                prompt = this.getConfirmationPrompt(prevSlot, option, matchNumber, matches.length);
                if (prompt) {
                    console.log(`match confirmation prompt for slot ${slotName} match ${matchNumber}`);
                    // Increment the match and redirect
                    sessionAttributes.matchNumber = ++matchNumber;
                    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                    return handlerInput.responseBuilder
                        .speak(prompt)
                        .reprompt(prompt)
                        .addConfirmSlotDirective(slotName)
                        .withSimpleCard(this.form.title, prompt)
                        .getResponse();
                }
                else {
                    // Add the last slot value session (or we will loose it when we redirect)
                    console.log(`adding match slot ${slotName} value ${value}`);
                    slotValues[slotName] = value;
                    this.clearMatches(sessionAttributes);
                }
            }
            else if (confirmationStatus === 'DENIED') {
                console.log(`Confirmation denied for slot ${slotName}`);
                // Clear match number.
                this.clearMatches(sessionAttributes);
                // currently keeps on eliciting the slot until it gets a valid input.
                const slots = this.getElicitSlots(slotValues);
                // slotNumer reduced by 1, so that the APL will get the correct slotNumber.
                return this.elicitSlotResponse(handlerInput, thisIntentName, prevSlot, slots, prevSlot.reprompt, slotNumber - 1, slotValues, aplTextListTemplateWithTouch);
            }
            else {
                // Get intent slots and current slot value
                const slots = this.getElicitSlots(slotValues);
                let value = '';
                if (currentIntent.slots[slotName] && currentIntent.slots[slotName].value) {
                    value = currentIntent.slots[slotName].value;
                }
                // Check if we have slot confirmation
                prompt = this.getConfirmationPrompt(prevSlot, value);
                if (prompt && confirmationStatus !== 'CONFIRMED') {
                    // Add the additional value for confirmation
                    slots[slotName] = {
                        name: slotName,
                        confirmationStatus: 'NONE',
                        value,
                    };
                    console.log(`confirmation for slot ${slotName} in ${thisIntentName}`);
                    return this.elicitSlotConfirmation(handlerInput, thisIntentName, prevSlot, slots, prompt);
                }
                // Check if we require slot validation
                prompt = this.getSlotValidation({ slot: prevSlot, value, user });
                if (prompt) {
                    console.log(`elicit slot ${slotName} again in ${thisIntentName}`);
                    return this.elicitSlotResponse(handlerInput, thisIntentName, prevSlot, slots, prompt, slotNumber, slotValues);
                }
            }
        }
        else if (currentIntent.slots) {
            // If we have been given a slotNumber, jump to that slot number
            const targetSlotNumber = 'targetSlotNumber';
            if (currentIntent.slots[targetSlotNumber] && currentIntent.slots[targetSlotNumber].value) {
                gotoSlot = Number(currentIntent.slots[targetSlotNumber].value);
            }
        }
        if (currentIntent.slots) {
            for (const formSlot of this.form.slots) {
                if (formSlot.name in currentIntent.slots && !slotValues[formSlot.name]) {
                    const value = currentIntent.slots[formSlot.name].value;
                    if (!this.getSlotValidation({ slot: formSlot, value, user })) {
                        console.log(`set valid slot: ${formSlot.name}`);
                        slotValues[formSlot.name] = value;
                    }
                }
            }
        }
        console.log(`updated slot values ${JSON.stringify(slotValues)}`);
        // Go directly to slot if goToSlot defined or else find the next available slot
        slotNumber = (gotoSlot !== undefined) ? gotoSlot : this.getNextSlotNumber(slotNumber, slotValues);
        // If we have a prompt function, call into this for prompt prefix - else get default prompt
        if (this.form.prompt && beginning) {
            prompt = this.form.prompt(slotNumber, slotValues, user);
        }
        prompt += this.getPromptPrefix(slotNumber);
        if (slotNumber === this.form.slots.length) {
            console.log(`intent confirmation to: ${this.form.delegate} from: ${currentIntent.name}`);
            // Check if this form requires confrirmation
            prompt = this.form.confirmation(this.form.slots, slotValues);
            // Get the target slot number if we were to start again
            const targetSlotNumber = this.getNextSlotNumber(0, slotValues);
            // set the completeForm true if the final slotNumber is same as the required target slotnumber.
            sessionAttributes.completeForm = (targetSlotNumber === slotNumber);
            // set the slot number in the session, so previous picks the correct previous slot.
            sessionAttributes.slotNumber = slotNumber;
            // Set the confirmation status on the form to delegate to
            this.clearSlotName(sessionAttributes);
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            console.log('just before delegating');
            const responseBuilder = handlerInput.responseBuilder
                .speak(prompt)
                .addConfirmIntentDirective({
                name: this.form.delegate,
                confirmationStatus: 'NONE',
            })
                .withSimpleCard(this.form.title, prompt)
                .withShouldEndSession(false);
            return this.supportsAPL(handlerInput) ?
                responseBuilder.addDirective(this.createRenderDirective(aplTextListTemplateWithTouch, slotValues, slotNumber, undefined, prompt)).getResponse()
                : responseBuilder.getResponse();
        }
        // Get the next slot and prompt
        const nextSlot = this.form.slots[slotNumber];
        prompt += nextSlot.prompt;
        // Update current intent and slot number and name in session
        sessionAttributes.intentName = thisIntentName;
        sessionAttributes.slotNumber = slotNumber + 1;
        sessionAttributes.slotName = nextSlot.name;
        sessionAttributes.slotValues = slotValues;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        if (nextSlot.type === 'AMAZON.NUMBER') {
            const responseBuilder = handlerInput.responseBuilder
                .speak(prompt)
                .reprompt(nextSlot.reprompt)
                .withSimpleCard(this.form.title, prompt)
                .addElicitSlotDirective('decimal_whole', {
                name: 'DecimalIntent',
                confirmationStatus: 'NONE',
                slots: this.getEmptyDecimalSlots(),
            });
            // Add the render document directive if screen supported.
            if (this.supportsAPL(handlerInput)) {
                responseBuilder.addDirective(this.createRenderDirective(aplTextListTemplateWithTouch, slotValues, slotNumber, nextSlot));
            }
            return responseBuilder.getResponse();
        }
        else {
            // Elicit the next slot
            const slots = this.getElicitSlots(slotValues);
            return this.elicitSlotResponse(handlerInput, thisIntentName, nextSlot, slots, prompt, slotNumber, slotValues, aplTextListTemplateWithTouch);
        }
    }
    // tslint:disable-next-line: typedef
    handleNext(handlerInput) {
        // Get the slot number session if it exists
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const { intentName, slotNumber } = sessionAttributes;
        // Clear the slot name since we will be skipping the last item
        this.clearSlotName(sessionAttributes);
        // Redirect back to form handler, it will be ready for next slot
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        console.log(`redirect to ${intentName} for slot ${slotNumber}`);
        return this.handle(handlerInput);
    }
    // tslint:disable-next-line: typedef
    handlePrevious(handlerInput) {
        // Get the slot number session if it exists
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const { intentName, slotValues } = sessionAttributes;
        let { slotNumber } = sessionAttributes;
        while (slotNumber > 0) {
            slotNumber--;
            const previousSlot = this.form.slots[slotNumber];
            if (previousSlot && slotValues[previousSlot.name]) {
                this.clearSlotName(sessionAttributes);
                delete sessionAttributes.slotValues[previousSlot.name];
                sessionAttributes.slotNumber = slotNumber;
                // Redirect back to form handler, it will be ready for previous slot
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                console.log(`redirect to ${intentName} for slot ${slotNumber}`);
                return this.handle(handlerInput);
            }
        }
        // First slot, don't have any previous slots.
        if (slotNumber === 0) {
            this.clearSlotName(sessionAttributes);
            sessionAttributes.slotNumber = slotNumber;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            console.log(`redirect to ${intentName} for first slot`);
            return this.handle(handlerInput);
        }
    }
    // tslint:disable-next-line: typedef
    handleWithSlots(handlerInput, slots) {
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        // Update the slots but not intent name
        for (const slot of slots) {
            currentIntent.slots[slot.name] = slot;
        }
        return this.handle(handlerInput);
    }
    // tslint:disable-next-line: typedef
    handleFormReview(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const { slotValues } = sessionAttributes;
        const aplSupported = (this.supportsAPL(handlerInput) !== undefined);
        let prompt;
        // Prompt can be defined as a string or a function.
        if (typeof this.form.reviewPrompt === 'function') {
            prompt = this.form.reviewPrompt(aplSupported, slotValues);
        }
        else if (typeof this.form.reviewPrompt === 'string') {
            prompt = this.form.reviewPrompt;
        }
        // If APL is supported add the directive for rendering.
        if (aplSupported) {
            const aplTextListTemplate = 'TextListWithTouch';
            return handlerInput.responseBuilder
                .speak(prompt)
                .addDirective(this.createFinalFormPageRenderDirective(slotValues, aplTextListTemplate))
                .withShouldEndSession(false)
                .getResponse();
        }
        return handlerInput.responseBuilder
            .speak(prompt)
            .withShouldEndSession(false)
            .getResponse();
    }
    // tslint:disable-next-line: typedef
    handleUserEvent(handlerInput) {
        // this is for handling usser events from
        const request = handlerInput.requestEnvelope.request;
        if (request && request.type === 'Alexa.Presentation.APL.UserEvent') {
            const secondaryValue = request.arguments[2] ? request.arguments[2].secondaryText : '';
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            if (this.form.slots[secondaryValue] && this.form.slots[secondaryValue].name && sessionAttributes.slotValues[this.form.slots[secondaryValue].name]) {
                delete sessionAttributes.slotValues[this.form.slots[secondaryValue].name];
            }
            // delete the slotName for the handle to go to the right slot.
            this.clearSlotName(sessionAttributes);
            sessionAttributes.slotNumber = Number(secondaryValue);
            const intentRequest = {
                type: 'IntentRequest',
                timestamp: request.timestamp,
                requestId: request.requestId,
                intent: {
                    name: request.token,
                    confirmationStatus: 'NONE',
                    slots: {
                        targetSlotNumber: {
                            // This name is being used in the handler to go to the right slotNumber for userEvents.
                            name: 'targetSlotNumber',
                            value: secondaryValue,
                            confirmationStatus: 'NONE',
                        },
                    },
                },
                dialogState: 'IN_PROGRESS',
            };
            // Change the APL request to an Intent request for the handle.
            console.log(`Apl converted request ${JSON.stringify(intentRequest)}`);
            handlerInput.requestEnvelope.request = intentRequest;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            return this.handle(handlerInput);
        }
    }
    /*** Private methods ***/
    clearMatches(sessionAttributes) {
        delete sessionAttributes.matches;
        delete sessionAttributes.matchNumber;
    }
    clearSlotName(sessionAttributes) {
        // Clear matches so that when we go back/next we don't lookup old matches
        this.clearMatches(sessionAttributes);
        delete sessionAttributes.slotName;
    }
    supportsAPL(handlerInput) {
        return (ask_sdk_core_1.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']);
    }
    getSlotValidation({ slot, value, user }) {
        // If there is any validation issues, return the validation prompt
        if (!value || value === '?') {
            return slot.reprompt;
        }
        // If we have slot options, ensure these are checked first
        if (slot.options) {
            if (!(value in slot.options)) {
                return slot.reprompt;
            }
        }
        // If we have validation return back the prompt
        if (slot.validation) {
            for (const val of slot.validation) {
                const prompt = val.validate(value, user);
                if (prompt) {
                    console.log('got slot validation', val, prompt);
                    return prompt;
                }
            }
        }
        return '';
    }
    getEmptyDecimalSlots() {
        return {
            decimal_sign: {
                name: 'decimal_sign',
                confirmationStatus: 'NONE',
            },
            decimal_whole: {
                name: 'decimal_whole',
                confirmationStatus: 'NONE',
            },
            decimal_fraction: {
                name: 'decimal_fraction',
                confirmationStatus: 'NONE',
            },
            decimal_units: {
                name: 'decimal_units',
                confirmationStatus: 'NONE',
            },
        };
    }
    getElicitSlots(slotValues) {
        const slots = {};
        for (const slot of this.form.slots) {
            slots[slot.name] = {
                name: slot.name,
                confirmationStatus: 'NONE',
                value: slotValues[slot.name],
            };
        }
        return slots;
    }
    elicitSlotConfirmation(handlerInput, targetIntent, targetSlot, slots, prompt) {
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        const responseBuilder = handlerInput.responseBuilder
            .speak(prompt)
            .reprompt(targetSlot.reprompt)
            .withSimpleCard(this.form.title, prompt);
        if (currentIntent.name === targetIntent) {
            console.log('elicit slot confirmation', targetSlot.name);
            responseBuilder
                .addConfirmSlotDirective(targetSlot.name);
            return responseBuilder.getResponse();
        }
        else {
            // This is the magic step which ensures we are able to switch between forms!!
            console.log('elicit confirmation from prev slot', targetSlot.name);
            responseBuilder
                .addConfirmSlotDirective(targetSlot.name, {
                name: targetIntent,
                confirmationStatus: 'NONE',
                slots,
            });
            return responseBuilder.getResponse();
        }
    }
    elicitSlotResponse(handlerInput, targetIntent, targetSlot, slots, prompt, slotNumber, slotValues, aplTemplate) {
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        const responseBuilder = handlerInput.responseBuilder
            .speak(prompt)
            .reprompt(targetSlot.reprompt);
        if (currentIntent.name === targetIntent) {
            console.log('elicit next slot', targetSlot.name);
            responseBuilder
                .addElicitSlotDirective(targetSlot.name);
        }
        else {
            // This is the magic step which ensures we are able to switch between forms!!
            console.log('elicit from prev slot', targetSlot.name);
            responseBuilder
                .addElicitSlotDirective(targetSlot.name, {
                name: targetIntent,
                confirmationStatus: 'NONE',
                slots,
            });
        }
        // Add the screen if it is supported and if the template is defined.
        // Pass the template to be used.
        return (this.supportsAPL(handlerInput) && aplTemplate) ?
            responseBuilder.addDirective(this.createRenderDirective(aplTemplate, slotValues, slotNumber, targetSlot)).getResponse() :
            responseBuilder.withSimpleCard(this.form.title, prompt).getResponse();
    }
    getPromptPrefix(slotNumber) {
        if (slotNumber < this.form.slots.length) {
            // Get the index from the slot or use slotNumber
            console.log(`get slot number: ${slotNumber}, length: ${this.form.slots.length}`);
            const index = this.form.slots[slotNumber].index;
            if (index) {
                return `${index}. `;
            }
        }
        return '';
    }
    getNextSlotNumber(slotNumber, slotValues) {
        for (let i = slotNumber; i < this.form.slots.length; i++) {
            // Return if slot required
            const slot = this.form.slots[i];
            if (!slotValues[slot.name]) {
                if (slot.required) {
                    console.log('required', slot);
                    return i;
                }
                else if (slot.conditional) {
                    // Else if we have a slot value that exists with same value return
                    for (const condition of slot.conditional) {
                        const value = slotValues[condition.name];
                        if (value) {
                            if (condition.value === value) {
                                console.log(`condition on value: ${value}`);
                                return i;
                            }
                            else if (condition.empty === false) {
                                console.log(`condition on not empty value: ${value}`);
                                return i;
                            }
                        }
                        else if (condition.empty === true) {
                            console.log(`condition on empty value: ${value}`);
                            return i;
                        }
                    }
                }
            }
        }
        // Else set to the length of the form as we are complete
        return this.form.slots.length;
    }
    getConfirmationPrompt(slot, value, index, count) {
        if (!value || value === '?') {
            return '';
        }
        if (slot.confirmation) {
            if (typeof slot.confirmation === 'function') {
                return slot.confirmation(value, index, count);
            }
            else if (typeof slot.confirmation === 'string') {
                return slot.confirmation;
            }
        }
        if (slot.confirmation === true || (count && count > 1)) {
            // If we have more than one matches output the number of matches
            const prompt = index === 0 && (count && count > 1) ? `I found ${count} matches. ` : '';
            return prompt + `Are you sure you want to add ${value}?`;
        }
        return '';
    }
    getPreviousSlotNumberWithValue(slotNumber, slotValues) {
        while (slotNumber > 0) {
            slotNumber--;
            const previousSlot = this.form.slots[slotNumber];
            if (previousSlot && slotValues[previousSlot.name]) {
                return slotNumber;
            }
        }
        return slotNumber;
    }
    createRenderDirective(aplTemplateName, slotValues, slotNumber, targetSlot, prompt) {
        const previousSlotNumber = this.getPreviousSlotNumberWithValue(slotNumber, slotValues);
        const previousSlotPrompt = this.form.slots[previousSlotNumber].prompt;
        const currentSlotPrompt = targetSlot ? targetSlot.prompt : (this.form.slots[slotNumber] ? this.form.slots[slotNumber].prompt : '');
        const currentSlotIndex = targetSlot ? targetSlot.index : (this.form.slots[slotNumber] ? this.form.slots[slotNumber].index : '');
        let nextSlotNumber = this.getNextSlotNumber(slotNumber, slotValues);
        if (nextSlotNumber === slotNumber) {
            nextSlotNumber = this.getNextSlotNumber(slotNumber + 1, slotValues);
        }
        const nextSlotPrompt = this.form.slots[nextSlotNumber] ? this.form.slots[nextSlotNumber].prompt : '';
        const listItems = [];
        let previousValue = slotValues[this.form.slots[previousSlotNumber].name];
        // For display on the primary screen
        const previous = this.form.aplProperties ? this.form.aplProperties.previousDisplayText : '';
        const current = this.form.aplProperties ? this.form.aplProperties.currentDisplayText : '';
        const next = this.form.aplProperties ? this.form.aplProperties.nextDisplayText : '';
        if (previousSlotPrompt && previousValue) {
            // If the slotValue is from a list of options like yes no, then get the value from the id.
            if (this.form.slots[previousSlotNumber] && this.form.slots[previousSlotNumber].options && this.form.slots[previousSlotNumber].options[previousValue]) {
                previousValue = this.form.slots[previousSlotNumber].options[previousValue][0];
            }
            listItems.push({
                primaryText: previous ? `${previous} :  ${previousSlotPrompt}  (${previousValue})` : `${previousSlotPrompt}  (${previousValue})`,
                secondaryText: previousSlotNumber.toString(),
            });
            // For the first question or questions skipped till the user answers, we need to show only the current question.
            // There is no previous slot with value.
            if (previousSlotNumber !== slotNumber) {
                if (currentSlotPrompt) {
                    listItems.push({
                        primaryText: current ? `${current} :  ${currentSlotPrompt}` : `${currentSlotPrompt}`,
                        secondaryText: slotNumber.toString(),
                    });
                }
            }
        }
        else if (currentSlotPrompt) {
            // add the current item if it is present.
            listItems.push({
                primaryText: current ? `${current} :  ${currentSlotPrompt}` : `${currentSlotPrompt}`,
                secondaryText: slotNumber.toString(),
            });
        }
        // add the next item if it is there.
        if (nextSlotPrompt) {
            listItems.push({
                primaryText: next ? `${next} :  ${nextSlotPrompt}` : `${nextSlotPrompt}`,
                secondaryText: nextSlotNumber.toString(),
            });
        }
        else if (prompt) {
            listItems.push({
                primaryText: `${prompt}`,
                secondaryText: nextSlotNumber.toString(),
            });
        }
        else if (this.form.aplProperties && this.form.aplProperties.endOfFormText) {
            listItems.push({
                primaryText: this.form.aplProperties.endOfFormText,
                secondaryText: nextSlotNumber.toString(),
            });
        }
        const renderDirective = {
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: apl_templates_1.textListTemplates[aplTemplateName],
            token: this.form.name + '_apl',
            datasources: {
                textListData: {
                    headerTitle: this.form.title,
                    headerSubtitle: currentSlotIndex,
                    listItemsToShow: listItems,
                },
            },
        };
        return renderDirective;
    }
    createFinalFormPageRenderDirective(slotValues, aplTemplateName) {
        // To be used for review intent to show all values on the screen and able to touch on the question to change the value.
        const listItems = [];
        for (let i = 0; i <= this.form.slots.length; i++) {
            const slot = this.form.slots[i];
            if (slot && slotValues[slot.name]) {
                let slotValue = slotValues[slot.name];
                if (slot.options && slot.options[slotValue]) {
                    slotValue = slot.options[slotValue][0];
                }
                listItems.push({
                    primaryText: slot.prompt + ' ( ' + slotValue + ' )',
                    secondaryText: i.toString(),
                });
            }
        }
        const renderDirective = {
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: apl_templates_1.textListTemplates[aplTemplateName],
            token: this.form.name + '_apl',
            datasources: {
                textListData: {
                    headerTitle: this.form.title,
                    headerSubtitle: this.form.name + ' final values',
                    listItemsToShow: listItems,
                },
            },
        };
        return renderDirective;
    }
}
exports.FormIntentHandler = FormIntentHandler;
//# sourceMappingURL=form-intent-handler.js.map