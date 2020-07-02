import { IntentRequestBuilder } from 'ask-sdk-test';

import {  alexaTest, checkEqualityOfListItemsToShow, skillSettings, today } from './testUtils';
describe('ConditionalSlotLogic', () => {

    describe('Previous Slot Value Based True', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotResolution('slot_one', 'yes', 'YES_NO', '1')
                    .withInterfaces({ apl: true })
                    .build(),
                says: '2. What is the value of pi (decimal)?',
                reprompts: 'What value for pi?',
                elicitsSlot: 'decimal_whole',
                elicitsForIntent: 'DecimalIntent',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_two',
                    slotValues: (v) => v.slot_one === '1',
                },
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_one',
                    slotNumber: 2,
                    slotValues: {
                        date: today,
                    },
                },
                renderDocument: {
                    token: 'FormIntent_apl',
                    document: (doc: any) => {
                        return doc !== undefined && doc.version === '1.3';
                    },
                    hasDataSources: {
                        textListData: (ds: any) => {
                            const listItems: any = [
                                {
                                    primaryText: 'Previous :  Do you know the value of pi?  (Yes)',
                                    secondaryText: '1',
                                },
                                {
                                    primaryText: 'What is the value of pi (decimal)?',
                                    secondaryText: '2',
                                },
                                {
                                    primaryText: 'Next :  What is the temperature (with units)?',
                                    secondaryText: '3',
                                }];
                            return ds !== undefined
                                && ds.headerTitle === 'Sample Form for Testing'
                                && ds.listItemsToShow !== undefined
                                && ds.listItemsToShow.length === 3
                                && checkEqualityOfListItemsToShow(listItems, ds.listItemsToShow);
                        },
                    },
                },
                shouldEndSession: false,
            },
        ]);
    });

    describe('Previous Slot Value Based False', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotResolution('slot_one', 'no', 'YES_NO', '0')
                    .withInterfaces({ apl: true })
                    .build(),
                says: '3. What is the temperature (with units)?',
                reprompts: 'What temperature?',
                elicitsSlot: 'decimal_whole',
                elicitsForIntent: 'DecimalIntent',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_three',
                    slotValues: (v) => v.slot_two === undefined && v.slot_one === '0',
                },
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_one',
                    slotNumber: 2,
                    slotValues: {
                        date: today,
                    },
                },
                renderDocument: {
                    token: 'FormIntent_apl',
                    document: (doc: any) => {
                        return doc !== undefined && doc.version === '1.3';
                    },
                    hasDataSources: {
                        textListData: (ds: any) => {
                            const listItems: any = [
                                {
                                    primaryText: 'Previous :  Do you know the value of pi?  (No)',
                                    secondaryText: '1',
                                },
                                {
                                    primaryText: 'What is the temperature (with units)?',
                                    secondaryText: '3',
                                },
                                {
                                    primaryText: 'Next :  Please add an element',
                                    secondaryText: '5',
                                }];
                            return ds !== undefined
                                && ds.headerTitle === 'Sample Form for Testing'
                                && ds.listItemsToShow !== undefined
                                && ds.listItemsToShow.length === 3
                                && checkEqualityOfListItemsToShow(listItems, ds.listItemsToShow);
                        },
                    },
                },
                shouldEndSession: false,
            },
        ]);
    });

    describe('Previous Slot Value Present Based True', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlot('slot_three', '10')
                    .withInterfaces({ apl: true })
                    .build(),
                says: '4. For what units?',
                reprompts: 'Is that in "Celsius" or "Fahrenheit"?',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_three_units',
                    slotValues: (v) => v.slot_three === '10',
                },
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_three',
                    slotNumber: 4,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                        slot_two: '3.14',
                    },
                },
                renderDocument: {
                    token: 'FormIntent_apl',
                    document: (doc: any) => {
                        return doc !== undefined && doc.version === '1.3';
                    },
                    hasDataSources: {
                        textListData: (ds: any) => {
                            const listItems: any = [
                                {
                                    primaryText: 'Previous :  What is the temperature (with units)?  (10)',
                                    secondaryText: '3',
                                },
                                {
                                    primaryText: 'For what units?',
                                    secondaryText: '4',
                                },
                                {
                                    primaryText: 'Next :  Please add an element',
                                    secondaryText: '5',
                                }];
                            return ds !== undefined
                                && ds.headerTitle === 'Sample Form for Testing'
                                && ds.listItemsToShow !== undefined
                                && ds.listItemsToShow.length === 3
                                && checkEqualityOfListItemsToShow(listItems, ds.listItemsToShow);
                        },
                    },
                },
                shouldEndSession: false,
            },
        ]);
    });

    describe('Previous Slot Value Present along with unresolved Units', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_two', 'CONFIRMED', '3.14') // REQUIRES brightsparc branch
                    .withInterfaces({ apl: true })
                    .build(),
                says: '3. What is the temperature (with units)?',
                reprompts: 'What temperature?',
                ignoreQuestionCheck: true,
                hasAttributes: {
                    slotName: 'slot_three',
                    slotValues: (v) => v.slot_two === '3.14',
                },
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_two',
                    slotNumber: 3,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                    },
                },
                renderDocument: {
                    token: 'FormIntent_apl',
                    document: (doc: any) => {
                        return doc !== undefined && doc.version === '1.3';
                    },
                    hasDataSources: {
                        textListData: (ds: any) => {
                            const listItems: any = [
                                {
                                    primaryText: 'Previous :  What is the value of pi (decimal)?  (3.14)',
                                    secondaryText: '2',
                                },
                                {
                                    primaryText: 'What is the temperature (with units)?',
                                    secondaryText: '3',
                                },
                                {
                                    primaryText: 'Next :  Please add an element',
                                    secondaryText: '5',
                                }];
                            return ds !== undefined
                                && ds.headerTitle === 'Sample Form for Testing'
                                && ds.listItemsToShow !== undefined
                                && ds.listItemsToShow.length === 3
                                && checkEqualityOfListItemsToShow(listItems, ds.listItemsToShow);
                        },
                    },
                },
                shouldEndSession: false,

            },
            {
                request: new IntentRequestBuilder(skillSettings, 'DecimalIntent')
                    .withEmptySlot('decimal_sign')
                    .withSlot('decimal_whole', '3')
                    .withEmptySlot('decimal_fraction')
                    .withSlotResolutionNoMatch('decimal_units', 'blaa', 'DECIMAL_UNITS')
                    .withInterfaces({ apl: true })
                    .build(),
                says: '4. For what units?',
                reprompts: 'Is that in "Celsius" or "Fahrenheit"?',
                ignoreQuestionCheck: true,
                hasAttributes: {
                    slotName: 'slot_three_units',
                    slotValues: (v) => v.slot_three === '3' && v.slot_three_units === undefined,

                },
                renderDocument: {
                    token: 'FormIntent_apl',
                    document: (doc: any) => {
                        return doc !== undefined && doc.version === '1.3';
                    },
                    hasDataSources: {
                        textListData: (ds: any) => {
                            const listItems: any = [
                                {
                                    primaryText: 'Previous :  What is the temperature (with units)?  (3)',
                                    secondaryText: '3',
                                },
                                {
                                    primaryText: 'For what units?',
                                    secondaryText: '4',
                                },
                                {
                                    primaryText: 'Next :  Please add an element',
                                    secondaryText: '5',
                                }];
                            return ds !== undefined
                                && ds.headerTitle === 'Sample Form for Testing'
                                && ds.listItemsToShow !== undefined
                                && ds.listItemsToShow.length === 3
                                && checkEqualityOfListItemsToShow(listItems, ds.listItemsToShow);
                        },
                    },
                },
                shouldEndSession: false,
            },
        ]);

        describe('Previous Slot Value Present along with Units', () => {
            alexaTest.test([
                {
                    request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                        .withSlotConfirmation('slot_two', 'CONFIRMED', '3.14') // REQUIRES brightsparc branch
                        .withInterfaces({ apl: true })
                        .build(),
                    says: '3. What is the temperature (with units)?',
                    reprompts: 'What temperature?',
                    ignoreQuestionCheck: true,
                    hasAttributes: {
                        slotName: 'slot_three',
                        slotValues: (v) => v.slot_two === '3.14',
                    },
                    withSessionAttributes: {
                        intentName: 'FormIntent',
                        slotName: 'slot_two',
                        slotNumber: 3,
                        slotValues: {
                            date: today,
                            slot_one: '1',
                        },
                    },
                    renderDocument: {
                        token: 'FormIntent_apl',
                        document: (doc: any) => {
                            return doc !== undefined && doc.version === '1.3';
                        },
                        hasDataSources: {
                            textListData: (ds: any) => {
                                const listItems: any = [
                                    {
                                        primaryText: 'Previous :  What is the value of pi (decimal)?  (3.14)',
                                        secondaryText: '2',
                                    },
                                    {
                                        primaryText: 'What is the temperature (with units)?',
                                        secondaryText: '3',
                                    },
                                    {
                                        primaryText: 'Next :  Please add an element',
                                        secondaryText: '5',
                                    }];
                                return ds !== undefined
                                    && ds.headerTitle === 'Sample Form for Testing'
                                    && ds.listItemsToShow !== undefined
                                    && ds.listItemsToShow.length === 3
                                    && checkEqualityOfListItemsToShow(listItems, ds.listItemsToShow);
                            },
                        },
                    },
                    shouldEndSession: false,
                },
                {
                    request: new IntentRequestBuilder(skillSettings, 'DecimalIntent')
                        .withEmptySlot('decimal_sign')
                        .withSlot('decimal_whole', '3')
                        .withEmptySlot('decimal_fraction')
                        .withSlotResolution('decimal_units', 'Celsius', 'DECIMAL_UNITS', 'C')
                        .withInterfaces({ apl: true })
                        .build(),
                    says: '5. Please add an element',
                    reprompts: 'What element?',
                    ignoreQuestionCheck: true,
                    hasAttributes: {
                        slotName: 'slot_four',
                        slotValues: (v) => v.slot_three === '3' && v.slot_three_units === 'C',

                    },
                    renderDocument: {
                        token: 'FormIntent_apl',
                        document: (doc: any) => {
                            return doc !== undefined && doc.version === '1.3';
                        },
                        hasDataSources: {
                            textListData: (ds: any) => {
                                const listItems: any = [
                                    {
                                        primaryText: 'Previous :  For what units?  (Celcius)',
                                        secondaryText: '4',
                                    },
                                    {
                                        primaryText: 'Please add an element',
                                        secondaryText: '5',
                                    },
                                    {
                                        primaryText: 'End of form',
                                        secondaryText: '6',
                                    }];
                                return ds !== undefined
                                    && ds.headerTitle === 'Sample Form for Testing'
                                    && ds.listItemsToShow !== undefined
                                    && ds.listItemsToShow.length === 3
                                    && checkEqualityOfListItemsToShow(listItems, ds.listItemsToShow);
                            },
                        },
                    },
                    shouldEndSession: false,
                },
            ]);
        });
    });

    describe('Previous Slot Value Present Based False', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_two', 'CONFIRMED', '3.14') // REQUIRES brightsparc branch
                    .build(),
                says: '3. What is the temperature (with units)?',
                reprompts: 'What temperature?',
                hasAttributes: {
                    slotName: 'slot_three',
                    slotValues: (v) => v.slot_two === '3.14',
                },
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_two',
                    slotNumber: 3,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                    },
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'AMAZON.NextIntent')
                    .build(),
                says: '5. Please add an element',
                ignoreQuestionCheck: true, // Should we have quesiton mark her?
                reprompts: 'What element?',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_four',
                    slotValues: (v) => v.slot_three === undefined && v.slot_three_units === undefined,
                },
                shouldEndSession: false,
            },
        ]);
    });
});
