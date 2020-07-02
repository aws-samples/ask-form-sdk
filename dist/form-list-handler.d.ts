import { HandlerInput } from 'ask-sdk-core';
import { Slot } from 'ask-sdk-model';
import { FormRequestHandler, UserHandler } from './form-handler-types';
import { FormProps } from './form-types';
export declare class FormListHandler implements FormRequestHandler {
    private handlers;
    constructor(forms: FormProps[], userHandler: UserHandler);
    canHandle(handlerInput: HandlerInput): boolean;
    isCurrent(handlerInput: HandlerInput): boolean;
    handle(handlerInput: HandlerInput): Promise<import("ask-sdk-model").Response>;
    handleNext(handlerInput: HandlerInput): Promise<import("ask-sdk-model").Response>;
    handlePrevious(handlerInput: HandlerInput): Promise<import("ask-sdk-model").Response>;
    handleWithSlots(handlerInput: HandlerInput, slots: Slot[]): Promise<import("ask-sdk-model").Response>;
    handleUserEvent(handlerInput: HandlerInput): Promise<import("ask-sdk-model").Response>;
    handleFormReview(handlerInput: HandlerInput): import("ask-sdk-model").Response;
}
