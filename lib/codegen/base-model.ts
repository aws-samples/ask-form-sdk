import { AlexaLocaleModel, Dialog, DialogIntent, InteractionModel, LanguageModel, LanguageModelIntent, LanguageModelType, TypeValue } from './model-types';

const cancelIntent: LanguageModelIntent = {
    name: 'AMAZON.CancelIntent',
    samples: [],
};

const helpIntent: LanguageModelIntent = {
    name: 'AMAZON.HelpIntent',
    samples: [],
};

const stopIntent: LanguageModelIntent = {
    name: 'AMAZON.StopIntent',
    samples: [],
};

const nextIntent: LanguageModelIntent = {
    name: 'AMAZON.NextIntent',
    samples: [],
};

const previousIntent: LanguageModelIntent = {
    name: 'AMAZON.PreviousIntent',
    samples: [],
};

const fallbackIntent: LanguageModelIntent = {
    name: 'AMAZON.FallbackIntent',
    samples: [],
};

const clearFormIntent: LanguageModelIntent = {
    name: 'ClearFormIntent',
    slots: [],
    samples: ['clear form'],
};

const reviewFormIntent: LanguageModelIntent = {
    name: 'ReviewFormIntent',
    slots: [],
    samples: ['review form'],
};

const decimalIntent: LanguageModelIntent = {
    name: 'DecimalIntent',
    samples:
        [
            'point {decimal_fraction} {decimal_units}',
            '{decimal_whole} point {decimal_fraction} {decimal_units}',
            '{decimal_whole} {decimal_units}',
            '{decimal_whole}',
            '{decimal_sign} point {decimal_fraction}',
            '{decimal_sign} {decimal_whole}',
            '{decimal_sign} {decimal_whole} point {decimal_fraction}',
            'point {decimal_fraction}',
            '{decimal_whole} dot {decimal_fraction}',
            '{decimal_whole} point {decimal_fraction}',
        ],
    slots:
        [
            {
                name: 'decimal_sign',
                type: 'DECIMAL_SIGN',
            },
            {
                name: 'decimal_whole',
                type: 'AMAZON.NUMBER',
            },
            {
                name: 'decimal_fraction',
                type: 'AMAZON.NUMBER',
            },
            {
                name: 'decimal_units',
                type: 'DECIMAL_UNITS',
            },
        ],
};

const intents: LanguageModelIntent[] = [
    cancelIntent,
    helpIntent,
    stopIntent,
    nextIntent,
    previousIntent,
    fallbackIntent,
    decimalIntent,
    clearFormIntent,
    reviewFormIntent,
];

const postivieSignType: TypeValue = {
    id: '+',
    name: {
        value: 'positive',
        synonyms: [
            'plus',
        ],
    },
};

const negativeSignType: TypeValue = {
    id: '-',
    name: {
        value: 'negative',
        synonyms: [
            'minus',
        ],
    },
};

const percentType: TypeValue = {
    id: 'P',
    name: {
        value: 'percentage',
        synonyms: [
            'percent',
        ],
    },
};

const decimalSignType: LanguageModelType = {
    name: 'DECIMAL_SIGN',
    values: [postivieSignType, negativeSignType],
};

const decimalUnitType: LanguageModelType = {
    name: 'DECIMAL_UNITS',
    values: [percentType],
};

const types: LanguageModelType[] = [
    decimalSignType,
    decimalUnitType,
];

const languageModel: LanguageModel = {
    intents,
    types,

};

const decimalDialogIntent: DialogIntent = {
    name: 'DecimalIntent',
    delegationStrategy: 'SKILL_RESPONSE',
    confirmationRequired: false,
    prompts: {},
    slots: [
        {
            name: 'decimal_sign',
            type: 'DECIMAL_SIGN',
            confirmationRequired: false,
            elicitationRequired: false,
            prompts: {},
        },
        {
            name: 'decimal_whole',
            type: 'AMAZON.NUMBER',
            confirmationRequired: false,
            elicitationRequired: false,
            prompts: {},
        },
        {
            name: 'decimal_fraction',
            type: 'AMAZON.NUMBER',
            confirmationRequired: false,
            elicitationRequired: false,
            prompts: {},
        },
        {
            name: 'decimal_units',
            type: 'DECIMAL_UNITS',
            confirmationRequired: false,
            elicitationRequired: false,
            prompts: {},
        },
    ],
};

const dialog: Dialog = {
    delegationStrategy: 'SKILL_RESPONSE',
    intents: [decimalDialogIntent],
};

const interactionModel: InteractionModel = {
    languageModel,
    dialog,
};

export const baseModel: AlexaLocaleModel = {
    interactionModel,
};
