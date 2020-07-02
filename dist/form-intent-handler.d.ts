import { HandlerInput } from 'ask-sdk-core';
import { Response, Slot } from 'ask-sdk-model';
import { FormRequestHandler, UserHandler } from './form-handler-types';
import { FormProps } from './form-types';
export declare class FormIntentHandler implements FormRequestHandler {
    private form;
    private userHandler;
    constructor(form: FormProps, userHandler: UserHandler);
    canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean;
    isCurrent(handlerInput: HandlerInput): boolean;
    handle(handlerInput: HandlerInput): Promise<Response>;
    handleNext(handlerInput: HandlerInput): Promise<Response>;
    handlePrevious(handlerInput: HandlerInput): Promise<Response>;
    handleWithSlots(handlerInput: HandlerInput, slots: Slot[]): Promise<Response>;
    handleFormReview(handlerInput: HandlerInput): Response;
    handleUserEvent(handlerInput: HandlerInput): Promise<Response>;
    /*** Private methods ***/
    private clearMatches;
    private clearSlotName;
    private supportsAPL;
    private getSlotValidation;
    private getEmptyDecimalSlots;
    private getElicitSlots;
    private elicitSlotConfirmation;
    private elicitSlotResponse;
    private getPromptPrefix;
    private getNextSlotNumber;
    private getConfirmationPrompt;
    private getPreviousSlotNumberWithValue;
    private createRenderDirective;
    private createFinalFormPageRenderDirective;
}
