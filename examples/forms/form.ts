import { DateDayValidation, FormProps, FormSlotProps, NumberRangeValidation, SlotValues, WholeNumberValidation } from '../../lib';

const yesNoOptions: { [key: string]: string[]; } = {
    '0': ['No'],
    '1': ['Yes'],
};

const temperateUnits: { [key: string]: string[]; } = {
    'C': [
        'Celcius',
        'degree celcius',
        'degrees celcius',
        'centigrade',
    ],
    'F': [
        'Fahrenheit',
        'degree fahrenheit',
        'degrees fahrenheit',
    ],
};

const formSlots: FormSlotProps[] = [
    {
        index: 0,
        name: 'date',
        type: 'AMAZON.DATE',
        prompt: 'What day are you recording for?',
        reprompt: 'For what day?',
        required: true, // NOTE: Don't allow skipping of these required fields.
        validation: [new DateDayValidation(7, 7)],
    },
    {
        index: 1,
        name: 'slot_one',
        type: 'YES_NO',
        prompt: 'Do you know the value of pi?',
        reprompt: 'Please say yes or no.',
        required: true,
        options: yesNoOptions,
    },
    {
        index: 2,
        name: 'slot_two',
        type: 'AMAZON.NUMBER',
        prompt: 'What is the value of pi (decimal)?',
        reprompt: 'What value for pi?',
        required: false,
        confirmation: (value) => `Are you sure you want to record ${value}?`,
        conditional: [{
            name: 'slot_one',
            value: '1', // Requires the slot_one to be yes
        }],
        validation: [new NumberRangeValidation(3.1, 3.2)],
    },
    {
        index: 3,
        name: 'slot_three',
        type: 'AMAZON.NUMBER',
        prompt: 'What is the temperature (with units)?',
        reprompt: 'What temperature?',
        required: true,
        validation: [
            new WholeNumberValidation('Please specify temperature as a whole number.'),
        ],
    },
    {
        index: 4,
        name: 'slot_three_units',
        type: 'TEMPERATURE_UNITS', // Can we just use the same general UNITS type?
        prompt: 'For what units?',
        reprompt: 'Is that in "Celsius" or "Fahrenheit"?',
        required: false,
        options: temperateUnits,
        conditional: [{
            name: 'slot_three',
            empty: false, // Conditional if the slot_three is not empty
        }],
    },
    {
        index: 5,
        name: 'slot_four',
        type: 'ELEMENTS',
        prompt: 'Please add an element',
        reprompt: 'What element?',
        required: true,
        confirmation: true, // Will prompt when only one match
        options: {
            'O': ['Oxygen'],
            'H': ['Hydrogen'],
            'H2O': ['Hydrogen plus Oxygen', 'Oxygen plus Hydrogen'],
            'N': ['Nitrogen'],
        },
    },
];

const formSamples: string[] = [
    'start form for {date}',
    'start form'
];

const form: FormProps = {
    name: 'FormIntent',
    prompt: (slotNumber: number) =>
        slotNumber === 0 ? 'Welcome to the form. ' : '', // If first slot add prompt
    slots: formSlots,
    confirmation: (slots: FormSlotProps[], slotValues: SlotValues) => {
        // Lookup the string values of the slot_one (yes/no) and slot_four (elements)
        const slotOne = slotValues.slot_one ? slots[1].options[slotValues.slot_one][0] : undefined;
        const slotFour = slotValues.slot_four ? slots[5].options[slotValues.slot_four][0] : undefined;
        return `Okay, would you like to save slot one of ${slotOne
            }, slot two of ${slotValues.slot_two
            }, slot three of ${slotValues.slot_three
            } and slot four of ${slotFour
            } ?`;
    },
    reviewPrompt: (aplSupported: boolean, slotValues: SlotValues) => {
        const count = slotValues && Object.keys(slotValues).length;
        let prompt = aplSupported ? `Values for ${count} fields are shown.` : `You have added ${count} fields.`;
        prompt = prompt + ' Say start form to return to the form';
        return prompt;
    },
    aplProperties: {
        nextDisplayText: 'Next',
        previousDisplayText: 'Previous',
        endOfFormText: 'End of form',
    },
    title: 'Sample Form for Testing',
    samples: formSamples,
    delegate: 'SaveFormIntent',
};

export default form;