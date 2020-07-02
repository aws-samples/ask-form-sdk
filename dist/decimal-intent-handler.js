"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecimalIntentHandler = void 0;
class DecimalIntentHandler {
    constructor(formsHandler) {
        this.formsHandler = formsHandler;
    }
    canHandle(handlerInput) {
        const { intentName } = handlerInput.attributesManager.getSessionAttributes();
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DecimalIntent'
            && intentName; // Handle if we have an intent name
    }
    // tslint:disable-next-line: typedef
    handle(handlerInput) {
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const { intentName, slotName } = sessionAttributes;
        console.log(`Decimal handler for ${intentName} slot ${slotName}`);
        if (currentIntent.confirmationStatus === 'DENIED') {
            console.log(`retry decimal ${slotName}`);
            return this.formsHandler.handlePrevious(handlerInput);
        }
        // Get the value from slots
        if (currentIntent.slots) {
            const { value, units } = this.parseFractionSlot(currentIntent.slots, 'decimal');
            console.log(`got decimal: ${value} units: ${units}`);
            if (this.formsHandler.isCurrent(handlerInput)) {
                const slots = [];
                if (value) {
                    slots.push({
                        name: slotName,
                        value: value.toString(),
                        confirmationStatus: 'NONE',
                    });
                }
                if (units) {
                    slots.push({
                        name: slotName + '_units',
                        value: units,
                        confirmationStatus: 'NONE',
                    });
                }
                console.log(`update with slots ${JSON.stringify(slots)}`);
                return this.formsHandler.handleWithSlots(handlerInput, slots);
            }
        }
        const prompt = `Unhandled decimnal`;
        return handlerInput.responseBuilder
            .speak(prompt)
            .withShouldEndSession(true)
            .getResponse();
    }
    /*** private methods ***/
    parseFractionSlot(slots, prefix) {
        // Get the value from slots
        const sign = this.getResolutionValue(slots, prefix + '_sign') || '';
        const whole = slots[prefix + '_whole'].value || '0';
        const fraction = slots[prefix + '_fraction'].value || '0';
        // Set the number if valid float
        let value;
        const num = parseFloat(`${sign}${whole}.${fraction}`);
        if (!isNaN(num)) {
            value = num;
        }
        // Check if we have unit units
        const units = this.getResolutionValue(slots, prefix + '_units');
        return { sign, whole, fraction, value, units };
    }
    getResolutionValue(slots, slotName) {
        const resolutions = slots[slotName].resolutions;
        if (resolutions && resolutions.resolutionsPerAuthority) {
            for (const res of resolutions.resolutionsPerAuthority) {
                if (res.status.code === 'ER_SUCCESS_MATCH') {
                    return res.values[0].value.id;
                }
            }
        }
        return undefined;
    }
}
exports.DecimalIntentHandler = DecimalIntentHandler;
//# sourceMappingURL=decimal-intent-handler.js.map