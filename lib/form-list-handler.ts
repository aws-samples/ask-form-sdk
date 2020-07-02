import { HandlerInput } from 'ask-sdk-core';
import { Slot } from 'ask-sdk-model';
import { FormRequestHandler, UserHandler } from './form-handler-types';
import { FormIntentHandler } from './form-intent-handler';
import { FormProps } from './form-types';

export class FormListHandler implements FormRequestHandler {
    private handlers: FormIntentHandler[];

    constructor(forms: FormProps[], userHandler: UserHandler) {
        // Create form intent handlers for each form props
        this.handlers = forms.map((form) => new FormIntentHandler(form, userHandler));
    }

    public canHandle(handlerInput: HandlerInput): boolean {
        for (const handler of this.handlers) {
            if (handler.canHandle(handlerInput)) {
                return true;
            }
        }
        return false;
    }

    public isCurrent(handlerInput: HandlerInput): boolean {
        for (const handler of this.handlers) {
            if (handler.isCurrent(handlerInput)) {
                return true;
            }
        }
        return false;
    }

    // tslint:disable-next-line: typedef
    public async handle(handlerInput: HandlerInput) {
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
    public handleNext(handlerInput: HandlerInput) {
        for (const handler of this.handlers) {
            if (handler.isCurrent(handlerInput)) {
                return handler.handleNext(handlerInput);
            }
        }
    }

    // tslint:disable-next-line: typedef
    public handlePrevious(handlerInput: HandlerInput) {
        for (const handler of this.handlers) {
            if (handler.isCurrent(handlerInput)) {
                return handler.handlePrevious(handlerInput);
            }
        }
    }

    // tslint:disable-next-line: typedef
    public handleWithSlots(handlerInput: HandlerInput, slots: Slot[]) {
        for (const handler of this.handlers) {
            if (handler.isCurrent(handlerInput)) {
                return handler.handleWithSlots(handlerInput, slots);
            }
        }
    }

    // tslint:disable-next-line: typedef
    public handleUserEvent(handlerInput: HandlerInput) {
        for (const handler of this.handlers) {
            if (handler.isCurrent(handlerInput)) {
                return handler.handleUserEvent(handlerInput);
            }
        }
    }

    // tslint:disable-next-line: typedef
    public handleFormReview(handlerInput: HandlerInput) {
        for (const handler of this.handlers) {
            if (handler.isCurrent(handlerInput)) {
                return handler.handleFormReview(handlerInput);
            }
        }
    }
}
