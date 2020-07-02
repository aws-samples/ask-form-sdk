import { FormProps, FormSlotProps, SlotValues, WholeNumberValidation } from '../../lib';

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
        index: 1,
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
        index: 2,
        name: 'slot_three_units',
        type: 'TEMPERATURE_UNITS',
        prompt: 'For what units?',
        reprompt: 'Is that in "Celsius" or "Fahrenheit"?',
        required: false,
        options: temperateUnits,
        conditional: [{
            name: 'slot_three',
            empty: false, // Conditional if the slot_three is not empty
        }],
    },

];

const formSamples: string[] = [
    'record temperature of {slot_three} {slot_three_units}',
    'record temperature of {slot_three}',
    'record temperature',
];

const form: FormProps = {
    name: 'TemperatureIntent',
    prompt: (slotNumber: number) =>
        slotNumber === 0 ? 'Welcome to the form. ' : '', // If first slot add prompt
    slots: formSlots,
    confirmation: (slots: FormSlotProps[], slotValues: SlotValues) => {
        // Lookup the string values of the slot_one (yes/no) and slot_four (elements)
        return `Okay, would you like to save the temperature?`;
    },
    samples: formSamples,
    title: 'Tempertature Form',
    delegate: 'SaveFormIntent',
};

export default form;