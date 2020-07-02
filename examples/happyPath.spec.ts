import { AplUserEventRequestBuilder, IntentRequestBuilder, LaunchRequestBuilder, SkillSettings } from 'ask-sdk-test';

import {  alexaTest, checkEqualityOfListItemsToShow, skillSettings, today } from './testUtils';

describe('Happy Path', () => {

    describe('LaunchRequest', () => {
        alexaTest.test([
            {
                request: new LaunchRequestBuilder(skillSettings).build(),
                says: 'Welcome to tonic playground.  You can start playing by saying start form.',
                reprompts: 'Welcome to tonic playground.  You can start playing by saying start form.',
                ignoreQuestionCheck: true,
                shouldEndSession: false,
            },
        ]);
    });

    describe('FormIntent complete form', () => {
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
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlot('slot_three', '10')
                    .withInterfaces({ apl: true })
                    .build(),
                says: '4. For what units?',
                reprompts: 'Is that in "Celsius" or "Fahrenheit"?',
                hasAttributes: {
                    slotName: 'slot_three_units',
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
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_three_units', 'CONFIRMED', 'C') // REQUIRES brightsparc branch
                    .withInterfaces({ apl: true })
                    .build(),
                says: '5. Please add an element',
                ignoreQuestionCheck: true, // Should we have quesiton mark her?
                reprompts: 'What element?',
                hasAttributes: {
                    slotName: 'slot_four',
                    slotValues: (v) => v.slot_three === '10',
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
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotResolution('slot_four', 'N', 'ELEMENTS', 'N')
                    .build(),
                says: 'Are you sure you want to add Nitrogen?',
                reprompts: 'Are you sure you want to add Nitrogen?',
                hasAttributes: {
                    slotName: 'slot_four',
                    slotValues: (v) => v.slot_three_units === 'C',
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_four', 'CONFIRMED', 'N') // REQUIRES brightsparc branch
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of 10 and slot four of Nitrogen ?',
                confirmsIntent: true,
                hasAttributes: {
                    slotValues: (v) => v.slot_four === 'N',
                    completeForm: true,
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
                                    primaryText: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of 10 and slot four of Nitrogen ?',
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
                    .build(),
                says: 'You have saved 6 slots.',
                hasAttributes: {
                    // No more attributes in session
                },
                shouldEndSession: true,
            },
        ]);
    });

});
