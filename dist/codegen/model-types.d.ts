export interface Slot {
    name: string;
    type: string;
}
export interface LanguageModelIntent {
    name: string;
    slots?: Slot[];
    samples: string[];
}
export interface TypeValueName {
    value: string;
    synonyms?: string[];
}
export interface TypeValue {
    name: TypeValueName;
    id?: string;
}
export interface LanguageModelType {
    name: string;
    values: TypeValue[];
}
export interface LanguageModel {
    invocationName?: string;
    intents: LanguageModelIntent[];
    types: LanguageModelType[];
}
export interface DialogSlot extends Slot {
    confirmationRequired: boolean;
    elicitationRequired: boolean;
    prompts: Prompt;
}
export interface DialogIntent {
    name: string;
    delegationStrategy?: string;
    confirmationRequired: boolean;
    prompts: Prompt;
    slots: DialogSlot[];
}
export interface Dialog {
    intents: DialogIntent[];
    delegationStrategy?: string;
}
export interface Variation {
    type: string;
    value: string;
}
export interface Prompt {
    id?: string;
    elicitation?: string;
    variations?: Variation[];
}
export interface InteractionModel {
    languageModel: LanguageModel;
    dialog?: Dialog;
    prompts?: Prompt[];
}
export interface AlexaLocaleModel {
    interactionModel: InteractionModel;
    version?: string;
}
