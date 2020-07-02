export interface UserProps {
    username: string;
    timeZone: string;
}
export interface SlotValidationProps {
    validate(value: string, user?: UserProps): string | undefined;
}
export interface SlotConditionProps {
    name: string;
    value?: string;
    empty?: boolean;
}
export interface FormSlotProps {
    index?: number;
    name: string;
    type: string;
    prompt: string;
    reprompt: string;
    required: boolean;
    validation?: SlotValidationProps[];
    confirmation?: boolean | string | ((value: string, index?: number, count?: number) => string);
    conditional?: SlotConditionProps[];
    options?: {
        [key: string]: string[];
    };
}
export declare type SlotValues = {
    [key: string]: string;
};
export interface APLProps {
    previousDisplayText?: string;
    currentDisplayText?: string;
    nextDisplayText?: string;
    endOfFormText?: string;
}
export interface FormProps {
    name: string;
    slots: FormSlotProps[];
    delegate: string;
    samples: string[];
    confirmation: ((slots: FormSlotProps[], slotValues: SlotValues) => string);
    prompt?: ((slotNumber: number, slotValues: SlotValues, user: UserProps) => string);
    reviewPrompt?: string | ((aplSupported: boolean, slotValues: SlotValues) => string);
    aplProperties?: APLProps;
    title: string;
}
export interface DecimalProps {
    sign?: string;
    whole?: string;
    fraction?: string;
    units?: string;
    value?: number;
}
export interface ListItem {
    primaryText: string;
    secondaryText?: string;
}
