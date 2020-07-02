import { IntentRequestBuilder } from 'ask-sdk-test';

import {  alexaTest, checkEqualityOfListItemsToShow, skillSettings, today } from './testUtils';

describe('List Disambiguation', () => {

    describe('No match', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotResolutionNoMatch('slot_four', 'blaa', 'ELEMENTS')
                    .build(),
                says: 'What element?',
                reprompts: 'What element?',
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_four',
                    slotNumber: 6,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                        slot_two: '3.14',
                        slot_three: '10',
                        slot_three_units: 'C',
                    },
                },
                hasAttributes: {
                    slotName: 'slot_four',
                    slotNumber: 6,
                },
                shouldEndSession: false,
            },
        ]);
    });

    describe('Confirm first match', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotResolution('slot_four', 'Oxygen', 'ELEMENTS', 'O')
                    .withSlotResolution('slot_four', 'Hydrogen plus Oxygen', 'ELEMENTS', 'H2O')
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'I found 2 matches. Are you sure you want to add Oxygen?',
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_four',
                    slotNumber: 6,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                        slot_two: '3.14',
                        slot_three: '10',
                        slot_three_units: 'C',
                    },
                },
                hasAttributes: {
                    slotName: 'slot_four',
                    slotNumber: 6,
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_four', 'CONFIRMED', 'N') // REQUIRES brightsparc branch
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of 10 and slot four of Oxygen ?',
                confirmsIntent: true,
                hasAttributes: {
                    slotNumber: 6,
                    slotValues: (v) => v.slot_four === 'O',
                    matches: undefined,
                    matchNumber: undefined,
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
                                    primaryText: 'Previous :  Please add an element  (Oxygen)',
                                    secondaryText: '5',
                                },
                                {
                                    primaryText: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of 10 and slot four of Oxygen ?',
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
        ]);
    });

    describe('Deny first and confirm second', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotResolution('slot_four', 'O', 'ELEMENTS', 'O')
                    .withSlotResolution('slot_four', 'H2O', 'ELEMENTS', 'H2O')
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'I found 2 matches. Are you sure you want to add Oxygen?',
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_four',
                    slotNumber: 6,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                        slot_two: '3.14',
                        slot_three: '10',
                        slot_three_units: 'C',
                    },
                },
                hasAttributes: {
                    slotName: 'slot_four',
                    slotNumber: 6,
                    matchNumber: 1,
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_four', 'DENIED') // REQUIRES brightsparc branch
                    .build(),
                says: 'Are you sure you want to add Hydrogen plus Oxygen?',
                hasAttributes: {
                    slotName: 'slot_four',
                    slotNumber: 6,
                    matchNumber: 2,
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_four', 'CONFIRMED', 'H2O') // REQUIRES brightsparc branch
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of 10 and slot four of Hydrogen plus Oxygen ?',
                confirmsIntent: true,
                hasAttributes: {
                    slotNumber: 6,
                    slotValues: (v) => v.slot_four === 'H2O',
                    matches: undefined,
                    matchNumber: undefined,
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
                                    primaryText: 'Previous :  Please add an element  (Hydrogen plus Oxygen)',
                                    secondaryText: '5',
                                },
                                {
                                    primaryText: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of 10 and slot four of Hydrogen plus Oxygen ?',
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
        ]);
    });

    describe('Deny all matches', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotResolution('slot_four', 'O', 'ELEMENTS', 'O')
                    .withSlotResolution('slot_four', 'H2O', 'ELEMENTS', 'H2O')
                    .build(),
                says: 'I found 2 matches. Are you sure you want to add Oxygen?',
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_four',
                    slotNumber: 6,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                        slot_two: '3.14',
                        slot_three: '10',
                        slot_three_units: 'C',
                    },
                },
                hasAttributes: {
                    slotName: 'slot_four',
                    slotNumber: 6,
                    matchNumber: 1,
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_four', 'DENIED') // REQUIRES brightsparc branch
                    .build(),
                says: 'Are you sure you want to add Hydrogen plus Oxygen?',
                hasAttributes: {
                    slotName: 'slot_four',
                    slotNumber: 6,
                    matchNumber: 2,
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_four', 'DENIED') // REQUIRES brightsparc branch
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'What element?',
                reprompts: 'What element?',
                hasAttributes: {
                    slotName: 'slot_four',
                    slotNumber: 6,
                    matchNumber: undefined,
                    matches: undefined,
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
                    .withSlotConfirmation('slot_four', 'CONFIRMED', 'H2O') // REQUIRES brightsparc branch
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of 10 and slot four of Hydrogen plus Oxygen ?',
                confirmsIntent: true,
                hasAttributes: {
                    slotNumber: 6,
                    slotValues: (v) => v.slot_four === 'H2O',
                    matches: undefined,
                    matchNumber: undefined,
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
                                    primaryText: 'Previous :  Please add an element  (Hydrogen plus Oxygen)',
                                    secondaryText: '5',
                                },
                                {
                                    primaryText: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of 10 and slot four of Hydrogen plus Oxygen ?',
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
        ]);
    });

    describe('Go back during match confirmation', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotResolution('slot_four', 'Oxygen', 'ELEMENTS', 'O')
                    .withSlotResolution('slot_four', 'Hydrogen plus Oxygen', 'ELEMENTS', 'H2O')
                    .build(),
                says: 'I found 2 matches. Are you sure you want to add Oxygen?',
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_four',
                    slotNumber: 6,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                        slot_two: '3.14',
                        slot_three: '10',
                        slot_three_units: 'C',
                    },
                },
                hasAttributes: {
                    slotName: 'slot_four',
                    slotNumber: 6,
                    matchNumber: 1,
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'AMAZON.PreviousIntent')
                    .withInterfaces({ apl: true })
                    .build(),
                says: '4. For what units?',
                reprompts: 'Is that in "Celsius" or "Fahrenheit"?',
                hasAttributes: {
                    slotName: 'slot_three_units',
                    slotNumber: 5,
                    matches: undefined,
                    matchNumber: undefined,
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
                    slotValues: (v) => v.slot_three_units === 'C',
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
                                },
                            ];
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

    describe('Skip during match confirmation', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotResolution('slot_four', 'Oxygen', 'ELEMENTS', 'O')
                    .withSlotResolution('slot_four', 'Hydrogen plus Oxygen', 'ELEMENTS', 'H2O')
                    .build(),
                says: 'I found 2 matches. Are you sure you want to add Oxygen?',
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_four',
                    slotNumber: 6,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                        slot_two: '3.14',
                        slot_three: '10',
                        slot_three_units: 'C',
                    },
                },
                hasAttributes: {
                    slotName: 'slot_four',
                    slotNumber: 6,
                    matchNumber: 1,
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'AMAZON.NextIntent')
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of 10 and slot four of undefined ?',
                confirmsIntent: true,
                hasAttributes: {
                    slotNumber: 6,
                    slotValues: (v) => v.slot_four === undefined,
                    matches: undefined,
                    matchNumber: undefined,
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
                                    primaryText: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of 10 and slot four of undefined ?',
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
        ]);
    });
});
