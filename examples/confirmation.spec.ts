import { IntentRequestBuilder } from 'ask-sdk-test';

import {  alexaTest, checkEqualityOfListItemsToShow, skillSettings, today } from './testUtils';

describe('Confirmation', () => {

    describe('Deny Pi', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_two', 'DENIED') // REQUIRES brightsparc branch
                    .build(),
                says: 'What value for pi?',
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_two',
                    slotNumber: 3,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                    },
                },
                hasAttributes: {
                    slotNumber: 3,
                },
            },
        ]);
    });

    describe('Confirm Save', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_four', 'CONFIRMED', 'N')
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of 10 and slot four of Nitrogen ?',
                confirmsIntent: true,
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_four',
                    slotNumber: 6,
                    matchNumber: 1, // Must be one for confirmation to work
                    matches: ['N'], // Must be list of ids
                    slotValues: {
                        date: today,
                        slot_one: '1',
                        slot_two: '3.14',
                        slot_three: '10',
                        slot_four: 'N',
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
                hasAttributes: {
                    slotNumber: 6,
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'SaveFormIntent')
                    .build(),
                says: 'You have saved 5 slots.',
                hasAttributes: {
                    // No more attributes in session
                },
                shouldEndSession: true,
            },
        ]);
    });

    describe('Deny Save', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent')
                    .withSlotConfirmation('slot_four', 'CONFIRMED', 'N')
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Okay, would you like to save slot one of Yes, slot two of 3.14, slot three of 10 and slot four of Nitrogen ?',
                confirmsIntent: true,
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_four',
                    slotNumber: 6,
                    matchNumber: 1, // Must be one for confirmation to work
                    matches: ['N'], // Must be list of ids
                    slotValues: {
                        date: today,
                        slot_one: '1',
                        slot_two: '3.14',
                        slot_three: '10',
                        slot_three_units: 'C',
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
                                    && ds.listItemsToShow.length === 3
                                    && checkEqualityOfListItemsToShow(listItems, ds.listItemsToShow);
                            },
                        },
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
                    .withIntentConfirmation('DENIED')
                    .build(),
                says: 'Okay, You can say "previous" to go back and change your responses.',
                ignoreQuestionCheck: true,
                hasAttributes: {
                    slotValues: (v) => {
                        // Check that we have saved the slot_four to session
                        return v.slot_four === 'N';
                    },
                },
                shouldEndSession: false,
            },
            {
                request: new IntentRequestBuilder(skillSettings, 'AMAZON.PreviousIntent')
                    .build(),
                says: '5. Please add an element',
                ignoreQuestionCheck: true,
                elicitsSlot: 'slot_four',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_four',
                    slotValues: (v) => {
                        // Check that we have cleared the slot_four from session
                        return v.slot_four === undefined;
                    },
                },
                shouldEndSession: false,
            },
        ]);
    });

});
