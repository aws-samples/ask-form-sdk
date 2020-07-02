"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormListHandler = void 0;
const form_intent_handler_1 = require("./form-intent-handler");
class FormListHandler {
    constructor(forms, userHandler) {
        // Create form intent handlers for each form props
        this.handlers = forms.map((form) => new form_intent_handler_1.FormIntentHandler(form, userHandler));
    }
    canHandle(handlerInput) {
        for (const handler of this.handlers) {
            if (handler.canHandle(handlerInput)) {
                return true;
            }
        }
        return false;
    }
    isCurrent(handlerInput) {
        for (const handler of this.handlers) {
            if (handler.isCurrent(handlerInput)) {
                return true;
            }
        }
        return false;
    }
    // tslint:disable-next-line: typedef
    async handle(handlerInput) {
        for (const handler of this.handlers) {
            if (handler.isCurrent(handlerInput)) {
                console.log(`Handling, current`);
                return handler.handle(handlerInput);
            }
        }
        for (const handler of this.handlers) {
            if (handler.canHandle(handlerInput)) {
                console.log(`Handling`);
                return handler.handle(handlerInput);
            }
        }
    }
    // tslint:disable-next-line: typedef
    handleNext(handlerInput) {
        for (const handler of this.handlers) {
            if (handler.isCurrent(handlerInput)) {
                return handler.handleNext(handlerInput);
            }
        }
    }
    // tslint:disable-next-line: typedef
    handlePrevious(handlerInput) {
        for (const handler of this.handlers) {
            if (handler.isCurrent(handlerInput)) {
                return handler.handlePrevious(handlerInput);
            }
        }
    }
    // tslint:disable-next-line: typedef
    handleWithSlots(handlerInput, slots) {
        for (const handler of this.handlers) {
            if (handler.isCurrent(handlerInput)) {
                return handler.handleWithSlots(handlerInput, slots);
            }
        }
    }
    // tslint:disable-next-line: typedef
    handleUserEvent(handlerInput) {
        for (const handler of this.handlers) {
            if (handler.isCurrent(handlerInput)) {
                return handler.handleUserEvent(handlerInput);
            }
        }
    }
    // tslint:disable-next-line: typedef
    handleFormReview(handlerInput) {
        for (const handler of this.handlers) {
            if (handler.isCurrent(handlerInput)) {
                return handler.handleFormReview(handlerInput);
            }
        }
    }
}
exports.FormListHandler = FormListHandler;
//# sourceMappingURL=form-list-handler.js.map