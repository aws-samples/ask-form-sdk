import { IntentRequestBuilder } from 'ask-sdk-test';

import { addDays, alexaTest, checkEqualityOfListItemsToShow, getDate, skillSettings, today } from './testUtils';

describe('Validation', () => {

    describe('DateDayValidation less than 7', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Welcome to the form. What day are you recording for?',
                reprompts: 'For what day?',
                elicitsSlot: 'date',
                // withProfile: profile,
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
                    .withSlot('date', getDate(addDays(new Date(), -8)))
                    .build(),
                says: 'Date must start within 7 days. For What day?',
                reprompts: 'For what day?',
                elicitsSlot: 'date',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'date',
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlot('date', '2020-W19') // eg last week
                    .build(),
                says: 'Please provide a specific date.  For what day?',
                reprompts: 'For what day?',
                elicitsSlot: 'date',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'date',
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlot('date', '2019') // eg last year
                    .build(),
                says: 'Please provide a specific date.  For what day?',
                reprompts: 'For what day?',
                elicitsSlot: 'date',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'date',
                },
                shouldEndSession: false,
            },
        ]);
    });

    describe('ListValidation yes/no', () => {
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
                    .withSlot('slot_one', '3')
                    .build(),
                says: 'Please say yes or no.',
                ignoreQuestionCheck: true,
                elicitsSlot: 'slot_one',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_one',
                },
                shouldEndSession: false,
            },
        ]);
    });

    describe('NumberRangeValidation pi', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'DecimalIntent')
                    .withEmptySlot('decimal_sign')
                    .withSlot('decimal_whole', '5')
                    .withEmptySlot('decimal_fraction')
                    .withEmptySlot('decimal_units')
                    .build(),
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_two',
                    slotNumber: 3,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                    },
                },
                says: 'Are you sure you want to record 5?',
                repromptsNothing: false,
                confirmsSlot: 'slot_two',
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_two', 'CONFIRMED', '5') // REQUIRES brightsparc branch
                    .build(),
                says: 'Please specify a value between 3.1 and 3.2.',
                ignoreQuestionCheck: true,
                reprompts: 'What value for pi?',
            },
        ]);
    });

    describe('Negative pi', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'DecimalIntent')
                    .withSlotResolution('decimal_sign', 'minus', 'DECIMAL_UNITS', '-')
                    .withSlot('decimal_whole', '1')
                    .withEmptySlot('decimal_fraction')
                    .withEmptySlot('decimal_units')
                    .build(),
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_two',
                    slotNumber: 3,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                    },
                },
                says: 'Are you sure you want to record -1?',
                confirmsSlot: 'slot_two',
                repromptsNothing: false,
                shouldEndSession: false,
            },
        ]);
    });

    describe('Positive pi', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'DecimalIntent')
                    .withSlotResolution('decimal_sign', 'plus', 'DECIMAL_UNITS', '+')
                    .withSlot('decimal_whole', '3')
                    .withSlot('decimal_fraction', '2')
                    .withEmptySlot('decimal_units')
                    .build(),
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_two',
                    slotNumber: 3,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                    },
                },
                says: 'Are you sure you want to record 3.2?',
                confirmsSlot: 'slot_two',
                repromptsNothing: false,
                shouldEndSession: false,
            },
        ]);
    });

    describe('Invalid pi', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'DecimalIntent')
                    .withEmptySlot('decimal_sign')
                    .withSlot('decimal_whole', '?') // Not a Number provided
                    .withEmptySlot('decimal_fraction')
                    .withEmptySlot('decimal_units')
                    .build(),
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_two',
                    slotNumber: 3,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                    },
                },
                says: 'What value for pi?',
                repromptsNothing: false,
                shouldEndSession: false,
            },
        ]);
    });

    describe('WholeNumberValidation temperature', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_three', 'CONFIRMED', '30.1') // REQUIRES brightsparc branch
                    .build(),
                says: 'Please specify temperature as a whole number.',
                ignoreQuestionCheck: true,
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_three',
                    slotNumber: 4,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                    },
                },
                hasAttributes: {
                    slotName: 'slot_three',
                    slotNumber: 4,
                },
                shouldEndSession: false,
            },
        ]);
    });

});
