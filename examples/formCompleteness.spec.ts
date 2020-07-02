import { IntentRequestBuilder } from 'ask-sdk-test';

import { alexaTest, checkEqualityOfListItemsToShow, skillSettings, today } from './testUtils';

describe('Form Completeness', () => {
    describe('FormIntent with skipped required fields', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Welcome to the form. What day are you recording for?',
                reprompts: 'For what day?',
                elicitsSlot: 'date',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'date',
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
                                    primaryText: 'What day are you recording for?',
                                    secondaryText: '0',
                                },
                                {
                                    primaryText: 'Next :  Do you know the value of pi?',
                                    secondaryText: '1',
                                }];
                            return ds !== undefined
                                && ds.headerTitle === 'Sample Form for Testing'
                                && ds.listItemsToShow !== undefined
                                && ds.listItemsToShow.length === 2
                                && checkEqualityOfListItemsToShow(listItems, ds.listItemsToShow);
                        },
                    },
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlot('date', today)
                    .withInterfaces({ apl: true })
                    .build(),
                says: '1. Do you know the value of pi?',
                reprompts: 'Please say yes or no.',
                elicitsSlot: 'slot_one',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_one',
                    slotValues: (v) => {
                        return v.date === today;
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
                                    primaryText: 'Previous :  What day are you recording for?  (' + today + ')',
                                    secondaryText: '0',
                                },
                                {
                                    primaryText: 'Do you know the value of pi?',
                                    secondaryText: '1',
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
            {
                request: new IntentRequestBuilder(skillSettings, 'DecimalIntent')
                    .withEmptySlot('decimal_sign')
                    .withSlot('decimal_whole', '3')
                    .withSlot('decimal_fraction', '14')
                    .withEmptySlot('decimal_units')
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Are you sure you want to record 3.14?',
                repromptsNothing: false,
                confirmsSlot: 'slot_two',
                hasAttributes: {
                    slotName: 'slot_two',
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_two', 'CONFIRMED', '3.14') // REQUIRES brightsparc branch
                    .withInterfaces({ apl: true })
                    .build(),
                says: '3. What is the temperature (with units)?',
                reprompts: 'What temperature?',
                hasAttributes: {
                    slotName: 'slot_three',
                    slotValues: (v) => v.slot_two === '3.14',
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
                request: new IntentRequestBuilder(skillSettings, 'AMAZON.NextIntent')
                    .withInterfaces({ apl: true })
                    .build(),
                says: '5. Please add an element',
                ignoreQuestionCheck: true,
                reprompts: 'What element?',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_four',
                    slotValues: (v) => v.slot_three === undefined && v.slot_three_units === undefined,
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
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotResolution('slot_four', 'N', 'ELEMENTS', 'N')
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Are you sure you want to add Nitrogen?',
                reprompts: 'Are you sure you want to add Nitrogen?',
                hasAttributes: {
                    slotName: 'slot_four',
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_four', 'CONFIRMED', 'N') // REQUIRES brightsparc branch
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of undefined and slot four of Nitrogen ?',
                confirmsIntent: true,
                hasAttributes: {
                    slotValues: (v) => v.slot_four === 'N',
                    completeForm: false,
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
                                    primaryText: 'Previous :  Please add an element  (Nitrogen)',
                                    secondaryText: '5',
                                },
                                {
                                    primaryText: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of undefined and slot four of Nitrogen ?',
                                    secondaryText: '6',
                                },
                            ];
                            return ds !== undefined
                                && ds.headerTitle === 'Sample Form for Testing'
                                && ds.listItemsToShow !== undefined
                                && ds.listItemsToShow.length === 2
                                && checkEqualityOfListItemsToShow(listItems, ds.listItemsToShow);
                        },
                    },
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'SaveFormIntent')
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'You have saved 4 slots.',
                hasAttributes: {
                    // No more attributes in session
                },
                shouldEndSession: true,
            },
        ]);
    });
});
