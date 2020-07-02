import { SlotValidationProps, UserProps } from './form-types';
export declare class WholeNumberValidation implements SlotValidationProps {
    private prompt?;
    constructor(prompt?: string);
    validate(value: string): string | undefined;
}
export declare class NumberRangeValidation implements SlotValidationProps {
    private min?;
    private max?;
    private prompt?;
    constructor(min?: number, max?: number, prompt?: string);
    validate(value: string): string | undefined;
}
export declare class DateDayValidation implements SlotValidationProps {
    private startWithin;
    private endWithin;
    private prompt?;
    constructor(startWithin: number, endWithin: number, prompt?: string);
    validate(value: string, user?: UserProps): string | undefined;
}
