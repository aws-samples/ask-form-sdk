import { AplUserEventRequestBuilder, IntentRequestBuilder, LaunchRequestBuilder, SkillSettings } from 'ask-sdk-test';

import {  alexaTest, checkEqualityOfListItemsToShow, skillSettings, today } from './testUtils';

describe('Review Form', () => {

    describe('Review Complete Form with APL', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'ReviewFormIntent')
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Values for 6 fields are shown. Say start form to return to the form',
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotNumber: 6,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                        slot_two: '3.14',
                        slot_three: '10',
                        slot_three_units: 'C',
                        slot_four: 'N',
                    },
                },
                ignoreQuestionCheck: true,
                renderDocument: {
                    token: 'FormIntent_apl',
                    document: (doc: any) => {
                        return doc !== undefined && doc.version === '1.3';
                    },
                    hasDataSources: {
                        textListData: (ds: any) => {
                            const listItems: any = [
                                {
                                    primaryText: 'What day are you recording for? ( ' + today + ' )',
                                    secondaryText: '0',
                                },
                                {
                                    primaryText: 'Do you know the value of pi? ( Yes )',
                                    secondaryText: '1',
                                },
                                {
                                    primaryText: 'What is the value of pi (decimal)? ( 3.14 )',
                                    secondaryText: '2',
                                },
                                {
                                    primaryText: 'What is the temperature (with units)? ( 10 )',
                                    secondaryText: '3',
                                },
                                {
                                    primaryText: 'For what units? ( Celcius )',
                                    secondaryText: '4',
                                },
                                {
                                    primaryText: 'Please add an element ( Nitrogen )',
                                    secondaryText: '5',
                                }];
                            return ds !== undefined
                                && ds.headerTitle === 'Sample Form for Testing'
                                && ds.listItemsToShow !== undefined
                                && ds.listItemsToShow.length === 6
                                && checkEqualityOfListItemsToShow(listItems, ds.listItemsToShow);
                        },
                    },
                },
                shouldEndSession: false,
            },
        ]);
    });

    describe('Touch Event on Review Form Screen', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'ReviewFormIntent')
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Values for 6 fields are shown. Say start form to return to the form',
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotNumber: 6,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                        slot_two: '3.14',
                        slot_three: '10',
                        slot_three_units: 'C',
                        slot_four: 'N',
                    },
                },
                ignoreQuestionCheck: true,
                renderDocument: {
                    token: 'FormIntent_apl',
                    document: (doc: any) => {
                        return doc !== undefined && doc.version === '1.3';
                    },
                    hasDataSources: {
                        textListData: (ds: any) => {
                            const listItems: any = [
                                {
                                    primaryText: 'What day are you recording for? ( ' + today + ' )',
                                    secondaryText: '0',
                                },
                                {
                                    primaryText: 'Do you know the value of pi? ( Yes )',
                                    secondaryText: '1',
                                },
                                {
                                    primaryText: 'What is the value of pi (decimal)? ( 3.14 )',
                                    secondaryText: '2',
                                },
                                {
                                    primaryText: 'What is the temperature (with units)? ( 10 )',
                                    secondaryText: '3',
                                },
                                {
                                    primaryText: 'For what units? ( Celcius )',
                                    secondaryText: '4',
                                },
                                {
                                    primaryText: 'Please add an element ( Nitrogen )',
                                    secondaryText: '5',
                                }];
                            return ds !== undefined
                                && ds.headerTitle === 'Sample Form for Testing'
                                && ds.listItemsToShow !== undefined
                                && ds.listItemsToShow.length === 6
                                && checkEqualityOfListItemsToShow(listItems, ds.listItemsToShow);
                        },
                    },
                },
                shouldEndSession: false,
            },
            {
                request: new AplUserEventRequestBuilder(skillSettings)
                    .withArguments(
                        'ListItemSelected',
                        1,
                        {
                            primaryText: 'What is the temperature (with units)? ( 10 )',
                            secondaryText: '3',
                        },
                    )
                    .withToken('FormIntent_apl')
                    .withInterfaces({ apl: true })
                    .build(),
                says: '3. What is the temperature (with units)?',
                reprompts: 'What temperature?',
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
                                }];
                            return ds !== undefined
                                && ds.headerTitle === 'Sample Form for Testing'
                                && ds.listItemsToShow !== undefined
                                && ds.listItemsToShow.length === 3
                                && checkEqualityOfListItemsToShow(listItems, ds.listItemsToShow);
                        },
                    },
                },
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_three',
                    slotNumber: 4,
                    slotValues: (v) => {
                        return v.slot_three === undefined;
                    },
                },
                shouldEndSession: false,
            },
        ]);
    });

    describe('Review Complete Form without APL', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'ReviewFormIntent')
                    .build(),
                says: 'You have added 6 fields. Say start form to return to the form',
                withSessionAttributes: {
                    intentName: 'FormIntent',
                    slotNumber: 6,
                    slotValues: {
                        date: today,
                        slot_one: '1',
                        slot_two: '3.14',
                        slot_three: '10',
                        slot_three_units: 'C',
                        slot_four: 'N',
                    },
                },
                ignoreQuestionCheck: true,
                shouldEndSession: false,
            },
        ]);
    });

});
