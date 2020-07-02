"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseModel = void 0;
const cancelIntent = {
    name: 'AMAZON.CancelIntent',
    samples: [],
};
const helpIntent = {
    name: 'AMAZON.HelpIntent',
    samples: [],
};
const stopIntent = {
    name: 'AMAZON.StopIntent',
    samples: [],
};
const nextIntent = {
    name: 'AMAZON.NextIntent',
    samples: [],
};
const previousIntent = {
    name: 'AMAZON.PreviousIntent',
    samples: [],
};
const fallbackIntent = {
    name: 'AMAZON.FallbackIntent',
    samples: [],
};
const clearFormIntent = {
    name: 'ClearFormIntent',
    slots: [],
    samples: ['clear form'],
};
const reviewFormIntent = {
    name: 'ReviewFormIntent',
    slots: [],
    samples: ['review form'],
};
const decimalIntent = {
    name: 'DecimalIntent',
    samples: [
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
    slots: [
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
const intents = [
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
const postivieSignType = {
    id: '+',
    name: {
        value: 'positive',
        synonyms: [
            'plus',
        ],
    },
};
const negativeSignType = {
    id: '-',
    name: {
        value: 'negative',
        synonyms: [
            'minus',
        ],
    },
};
const percentType = {
    id: 'P',
    name: {
        value: 'percentage',
        synonyms: [
            'percent',
        ],
    },
};
const decimalSignType = {
    name: 'DECIMAL_SIGN',
    values: [postivieSignType, negativeSignType],
};
const decimalUnitType = {
    name: 'DECIMAL_UNITS',
    values: [percentType],
};
const types = [
    decimalSignType,
    decimalUnitType,
];
const languageModel = {
    intents,
    types,
};
const decimalDialogIntent = {
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
const dialog = {
    delegationStrategy: 'SKILL_RESPONSE',
    intents: [decimalDialogIntent],
};
const interactionModel = {
    languageModel,
    dialog,
};
exports.baseModel = {
    interactionModel,
};
//# sourceMappingURL=base-model.js.map