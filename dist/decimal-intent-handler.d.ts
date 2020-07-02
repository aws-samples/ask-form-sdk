import { HandlerInput } from 'ask-sdk-core';
import { FormRequestHandler } from './form-handler-types';
export declare class DecimalIntentHandler {
    private formsHandler;
    constructor(formsHandler: FormRequestHandler);
    canHandle(handlerInput: HandlerInput): boolean;
    handle(handlerInput: HandlerInput): import("ask-sdk-model").Response | Promise<import("ask-sdk-model").Response>;
    /*** private methods ***/
    private parseFractionSlot;
    private getResolutionValue;
}
