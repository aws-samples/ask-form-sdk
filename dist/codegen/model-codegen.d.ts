import { FormProps } from '../form-types';
import { AlexaLocaleModel } from './model-types';
export declare class ModelCodegen {
    static update(forms: FormProps[], modelJson: AlexaLocaleModel, invocationName?: string): void;
    static codegen(formsPath: string, targetPath: string, sourcePath?: string, invocationName?: string): Promise<void>;
    private static updateModelFromBase;
}
