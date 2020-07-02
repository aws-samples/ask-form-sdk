/* tslint:disable */

// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
import { HandlerInput, LambdaHandler, RequestHandler, SkillBuilders } from 'ask-sdk-core';
import { IntentRequest } from 'ask-sdk-model';

// Import my form slots props and values
import { DecimalIntentHandler, FormListHandler, FormRequestHandler, SessionProps, UserHandler, UserProps } from '../lib';

// Load the forms here
import { forms } from './forms';

const LaunchRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput: HandlerInput) {
        const speakOutput = 'Welcome to tonic playground.  You can start playing by saying start form.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};

class NextHandler implements RequestHandler {
    private formsHandler: FormRequestHandler;

    constructor(formsHandler: FormRequestHandler) {
        this.formsHandler = formsHandler;
    }

    canHandle(handlerInput: HandlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent';
    }

    handle(handlerInput: HandlerInput) {
        if (this.formsHandler.isCurrent(handlerInput)) {
            return this.formsHandler.handleNext(handlerInput);
        }

        const prompt = `Sorry I am not in a session`;
        return handlerInput.responseBuilder
            .speak(prompt)
            .withShouldEndSession(true)
            .getResponse();
    }
}

class PreviousHandler implements RequestHandler {
    private formsHandler: FormRequestHandler;

    constructor(formsHandler: FormRequestHandler) {
        this.formsHandler = formsHandler;
    }

    canHandle(handlerInput: HandlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent';
    }

    handle(handlerInput: HandlerInput) {
        if (this.formsHandler.isCurrent(handlerInput)) {
            return this.formsHandler.handlePrevious(handlerInput);
        }

        const prompt = `Sorry I am not in a session`;
        return handlerInput.responseBuilder
            .speak(prompt)
            .withShouldEndSession(true)
            .getResponse();
    }
}

class FormReviewHandler implements RequestHandler {
    private formsHandler: FormRequestHandler;

    constructor(formsHandler: FormRequestHandler) {
        this.formsHandler = formsHandler;
    }

    canHandle(handlerInput: HandlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ReviewFormIntent';
    }

    handle(handlerInput: HandlerInput) {
        if (this.formsHandler.isCurrent(handlerInput)) {
            return this.formsHandler.handleFormReview(handlerInput);
        }

        const prompt = `Sorry I am not in a session.`;
        return handlerInput.responseBuilder
            .speak(prompt)
            .withShouldEndSession(false)
            .getResponse();
    }
};

class AplHandler {
    private formsHandler: FormRequestHandler;

    constructor(formsHandler: FormRequestHandler) {
        this.formsHandler = formsHandler;
    }

    canHandle(handlerInput: HandlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent'
            && handlerInput.requestEnvelope.request.arguments !== undefined);
    }

    handle(handlerInput: HandlerInput) {
        if (this.formsHandler.isCurrent(handlerInput)) {
            return this.formsHandler.handleUserEvent(handlerInput);
        }

        const prompt = `Sorry I can't help you with that.`;
        return handlerInput.responseBuilder
            .speak(prompt)
            .withShouldEndSession(false)
            .getResponse();
    }
}

const clearSession = (handlerInput: HandlerInput) => {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes() as SessionProps;

    // Get the slot values in a local variable before clearing the session
    const slotValues = sessionAttributes.slotValues;
    // tslint:disable-next-line: forin
    for (const key in sessionAttributes) {
        delete sessionAttributes[key];
    }

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    return slotValues;
}

const ClearFormIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ClearFormIntent';
    },
    handle(handlerInput: HandlerInput) {
        // Clear all fields in session
        clearSession(handlerInput);

        const prompt = 'Okay form cleared, you can now say "start form".';
        const reprompt = 'Say "start form" to begin.';
        return handlerInput.responseBuilder
            .speak(prompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const SaveFormIntentHandler = {
    canHandle(handlerInput: HandlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SaveFormIntent';
    },
    handle(handlerInput: HandlerInput) {
        console.log('inside the save form handler');
        const currentIntent = (handlerInput.requestEnvelope.request as IntentRequest).intent;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes() as SessionProps;
        const { intentName } = sessionAttributes;

        // If the use says no, then redirect back to calling form
        if (currentIntent.confirmationStatus === 'DENIED') {
            console.log(`save denied, redirect back to ${intentName}`);
            return handlerInput.responseBuilder
                .speak(`Okay, You can say "previous" to go back and change your responses.`)
                .addConfirmIntentDirective({
                    name: intentName,
                    confirmationStatus: 'DENIED',
                    slots: {},
                })
                .withShouldEndSession(false)
                .getResponse();
        }

        // Call into the clear session, getting back slot values
        const slotValues = clearSession(handlerInput);
        const count = slotValues && Object.keys(slotValues).length;

        if (count) {
            // Get the number of values we have saved
            return handlerInput.responseBuilder
                .speak(`You have saved ${count} slots.`)
                .withShouldEndSession(true)
                .getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak(`There was nothing to save.  Say "start form" to begin.`)
                .withShouldEndSession(false)
                .getResponse();
        }
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput: HandlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput: HandlerInput) {
        const speakOutput = 'You can say start form.  How can i help?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput: HandlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput: HandlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput: HandlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput: HandlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    },
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput: HandlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput: HandlerInput) {
        const currentIntent = (handlerInput.requestEnvelope.request as IntentRequest).intent;
        const speakOutput = `You just triggered ${currentIntent.name}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    },
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput: HandlerInput, error: Error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    },
};

const RequestLog = {
    process(handlerInput: HandlerInput) {
        console.log('REQUEST ENVELOPE = ' + JSON.stringify(handlerInput.requestEnvelope));
        return;
    },
};

const ApiUserHandler: UserHandler = {
    async getUser(handlerInput: HandlerInput): Promise<UserProps | undefined> {
        // NOTE: Should we allow loading this from session
        const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
        if (handlerInput.serviceClientFactory) {
            const upsServiceClient = handlerInput.serviceClientFactory.getUpsServiceClient();
            return {
                username: await upsServiceClient.getProfileName(),
                timeZone: await upsServiceClient.getSystemTimeZone(deviceId),
            };
        }
    },
    canHandle(): boolean {
        // Insert the logic here for checking if the requested user is valid and has privileges.
        return true;
    }
};

const formsHandler = new FormListHandler(forms, ApiUserHandler);

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
export const handler: LambdaHandler = SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        new DecimalIntentHandler(formsHandler), // pickup decimal from main frokm
        formsHandler,
        new NextHandler(formsHandler), // pick up skip and delegate back to form
        new PreviousHandler(formsHandler), // pick up previous slot and delegate back to form
        new AplHandler(formsHandler),
        new FormReviewHandler(formsHandler),
        ClearFormIntentHandler,
        SaveFormIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addRequestInterceptors(RequestLog)
    .addErrorHandlers(ErrorHandler)
    .lambda();
