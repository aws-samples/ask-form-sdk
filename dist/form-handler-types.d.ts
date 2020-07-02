import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, Slot } from 'ask-sdk-model';
import { SlotValues, UserProps } from './form-types';
export declare type IntentSlots = {
    [key: string]: Slot;
};
export interface SessionProps {
    intentName?: string;
    slotNumber?: number;
    slotName: string;
    slotValues?: SlotValues;
    matches?: string[];
    matchNumber?: number;
    completeForm?: boolean;
}
export interface UserHandler {
    canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean;
    getUser(handlerInput: HandlerInput): Promise<UserProps | undefined>;
}
export interface FormRequestHandler extends RequestHandler {
    isCurrent(handlerInput: HandlerInput): Promise<boolean> | boolean;
    handleNext(handlerInput: HandlerInput): Promise<Response> | Response;
    handlePrevious(handlerInput: HandlerInput): Promise<Response> | Response;
    handleWithSlots(handlerInput: HandlerInput, slots: Slot[]): Promise<Response> | Response;
    handleUserEvent(handlerInput: HandlerInput): Promise<Response> | Response;
    handleFormReview(handlerInput: HandlerInput): Promise<Response> | Response;
}
