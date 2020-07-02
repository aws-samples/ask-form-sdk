// import form from './form';
import { FormProps, FormSlotProps } from '../form-types';
import { AlexaLocaleModel, DialogIntent, DialogSlot, LanguageModelIntent, LanguageModelType, Slot, TypeValue } from './model-types';

// promise based file io
import { promises as fs } from 'fs';

// import the base model and the required additional list of intents to  be added.
import { types } from 'util';
import { baseModel } from './base-model';

export class ModelCodegen {

    public static update(forms: FormProps[], modelJson: AlexaLocaleModel, invocationName?: string): void {
        for (const form of forms) {

            if (form && form.name && form.slots) {
                const slots: FormSlotProps[] = form.slots;

                // Dialog, Type and Language model values from the form fields.
                const newDialogSlots: DialogSlot[] = [];
                let newDialogIntent: DialogIntent;
                const newLanguageModelTypes: LanguageModelType[] = [];
                const newLanguageModelSlots: Slot[] = [];

                // get the slots for the dialog from the form slots.
                for (const slot of slots) {
                    const slotName: string = slot.name;
                    const slotType: string = slot.type;
                    if (slot) {
                        // populate the slots for the intent for languageModel
                        const languageModelSlot: Slot = {
                            name: slotName,
                            type: slotType,
                        };
                        newLanguageModelSlots.push(languageModelSlot);

                        // populate the slots for the intent for Dialog
                        const newDialogSlot: DialogSlot = {
                            name: slotName,
                            type: slotType,
                            confirmationRequired: false,
                            elicitationRequired: false,
                            prompts: {},
                        };
                        newDialogSlots.push(newDialogSlot);
                    }
                    const options = slot.options;
                    // create the new types for the language model.
                    if (options) {
                        const typeValues: TypeValue[] = [];
                        for (const key in options) {
                            if (options[key] && options[key].length > 0 && options[key][0]) {
                                const value = options[key][0];
                                const typeValue: TypeValue = {
                                    id: key,
                                    name: {
                                        value,
                                        synonyms: options[key].slice(1),
                                    },
                                };
                                typeValues.push(typeValue);
                            }
                        }
                        const languageModelType = {
                            name: slotType,
                            values: typeValues,

                        };
                        newLanguageModelTypes.push(languageModelType);
                    }
                }
                // create the intent for the dialog from the slots and the name of the intent from the form.
                newDialogIntent = {
                    name: form.name,
                    delegationStrategy: 'SKILL_RESPONSE',
                    confirmationRequired: false,
                    prompts: {},
                    slots: newDialogSlots,

                };
                // create the intent for the language model from the slots and the name of the intent from the form.
                const newLanguageModelIntent: LanguageModelIntent = {
                    name: form.name,
                    samples: form.samples,
                    slots: newLanguageModelSlots,
                };

                if (modelJson && modelJson.interactionModel) {
                    // get the existing Dialog details from interaction model
                    if (modelJson.interactionModel.dialog && modelJson.interactionModel.dialog.intents) {
                        const dialogIntents = modelJson.interactionModel.dialog.intents;
                        let intentExists: boolean = false;
                        for (let i = 0; i < dialogIntents.length; i++) {
                            if (dialogIntents[i] && dialogIntents[i].name === form.name) {
                                modelJson.interactionModel.dialog.intents[i] = newDialogIntent;
                                intentExists = true;
                                break;
                            }
                        }
                        if (!intentExists) {
                            modelJson.interactionModel.dialog.intents.push(newDialogIntent);
                        }
                    } else if (modelJson.interactionModel.dialog) {
                        modelJson.interactionModel.dialog.intents = [newDialogIntent];
                    } else {
                        modelJson.interactionModel.dialog = {
                            intents: [newDialogIntent],
                            delegationStrategy: 'SKILL_RESPONSE',
                        };
                    }
                    // Get the Language model details from the interaction model.
                    if (modelJson.interactionModel.languageModel) {
                        // Replace the intent if it is present.
                        if (modelJson.interactionModel.languageModel.intents) {
                            const languageModelIntents = modelJson.interactionModel.languageModel.intents;
                            let intentExists: boolean = false;
                            for (let i = 0; i < languageModelIntents.length; i++) {
                                if (languageModelIntents[i] && languageModelIntents[i].name === form.name) {
                                    modelJson.interactionModel.languageModel.intents[i] = newLanguageModelIntent;
                                    intentExists = true;
                                    break;
                                }
                            }
                            // Add the intent if it is not present in the model.
                            if (!intentExists) {
                                modelJson.interactionModel.languageModel.intents.push(newLanguageModelIntent);
                            }
                        } else if (modelJson.interactionModel.languageModel) {
                            // create new intents array.
                            modelJson.interactionModel.languageModel.intents = [newLanguageModelIntent];
                        }

                        if (modelJson.interactionModel.languageModel.types) {
                            const languageModelTypes: LanguageModelType[] = modelJson.interactionModel.languageModel.types;
                            if (newLanguageModelTypes) {
                                // tslint:disable-next-line: prefer-for-of
                                for (let i = 0; i < newLanguageModelTypes.length; i++) {
                                    let typeExist = false;
                                    for (let j = 0; j < languageModelTypes.length; j++) {
                                        if (languageModelTypes[j].name === newLanguageModelTypes[i].name) {
                                            modelJson.interactionModel.languageModel.types[j] = newLanguageModelTypes[i];
                                            typeExist = true;
                                        }
                                    }
                                    if (!typeExist) {
                                        modelJson.interactionModel.languageModel.types.push(newLanguageModelTypes[i]);
                                    }
                                }
                            }
                        } else if (newLanguageModelTypes) {
                            modelJson.interactionModel.languageModel.types = newLanguageModelTypes;
                        }
                        // If the code gen is from base sample, the invocationName needs to be added.
                        if (!modelJson.interactionModel.languageModel.invocationName) {
                            modelJson.interactionModel.languageModel.invocationName = invocationName;
                        }
                    } else {
                        modelJson.interactionModel.languageModel = {
                            invocationName: invocationName ? invocationName : form.name,
                            intents: [newLanguageModelIntent],
                            types: newLanguageModelTypes,
                        };

                    }

                }
            }
        }
    }

    public static async codegen(formsPath: string, targetPath: string, sourcePath?: string, invocationName?: string): Promise<void> {
        // Import the forms
        const formImport = await import(formsPath);
        const forms = formImport.forms as FormProps[];

        if (!sourcePath && !invocationName) {
            console.log('Please provide invocation name to create the model or provide the source model');
            return;
        }
        let inputModel: AlexaLocaleModel;
        if (!sourcePath) {
            baseModel.interactionModel.languageModel.invocationName = invocationName;
            inputModel = baseModel;

        } else {
            // Read input as json
            const data = await fs.readFile(sourcePath, 'utf8');
            inputModel = sourcePath ? JSON.parse(data) as AlexaLocaleModel : baseModel;
        }
        this.update(forms, inputModel);

        if (sourcePath) {
            this.updateModelFromBase(inputModel);
        }

        // Create outputs as json
        const modelJson = JSON.stringify(inputModel, null, 2);
        console.log(modelJson);
        await fs.writeFile(targetPath, modelJson, { encoding: 'utf-8' });
    }

    // Add the intent only if it doesn't exist.
    private static updateModelFromBase(modelJson: AlexaLocaleModel): void {
        for (const baseIntent of baseModel.interactionModel.languageModel.intents) {
            if (!modelJson.interactionModel.languageModel.intents) {
                modelJson.interactionModel.languageModel.intents = [baseIntent];
            }
            if (modelJson.interactionModel.languageModel.intents.filter(
                (t) => t.name === baseIntent.name).length === 0
            ) {
                modelJson.interactionModel.languageModel.intents.push(baseIntent);
            }
        }

        for (const baseLanguageType of baseModel.interactionModel.languageModel.types) {
            if (modelJson.interactionModel.languageModel.types.filter(
                (t) => t.name === baseLanguageType.name).length === 0
            ) {
                modelJson.interactionModel.languageModel.types.push(baseLanguageType);
            }
        }

        for (const baseDialogIntent of baseModel.interactionModel.dialog.intents) {
            if (modelJson.interactionModel.dialog.intents.filter(
                (t) => t.name === baseDialogIntent.name).length === 0
            ) {
                modelJson.interactionModel.dialog.intents.push(baseDialogIntent);
            }
        }
    }
}
