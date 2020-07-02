import { textListTemplates } from '../lib/apl-templates/';
import { TextListWithTouch } from '../lib/apl-templates/text-list-with-touch';

import { AplUserEventRequestBuilder, IntentRequestBuilder } from 'ask-sdk-test';

import { alexaTest, checkEqualityOfListItemsToShow, skillSettings, today } from './testUtils';

describe('APL Document', () => {

    describe('Compare template files', () => {
        // Load forms using the @forms declared in package.json
        const TextListKey = 'TextListWithTouch';
        if (textListTemplates &&  TextListWithTouch && textListTemplates[TextListKey] === TextListWithTouch) {
            console.log('success');
        } else if (textListTemplates === undefined) {
            throw new Error('apl-templates map was not loaded ');
        } else if (TextListWithTouch === undefined) {
            throw new Error('apl-template TextList was not loaded ');
        } else if (textListTemplates[TextListKey] !== TextListWithTouch) {
            throw new Error('apl-template does not contain the same TextList');
        } else {
            throw new Error('Apl template test cases failed');
        }
    });

});

describe('APL touch actions', () => {
    describe('Go back to date with APL touch', () => {
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
                    slotNumber: 1,
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
                request: new AplUserEventRequestBuilder(skillSettings)
                    .withArguments(
                        'ListItemSelected',
                        1,
                        {
                            primaryText: `Previous :  What day are you recording for? (${today})`,
                            secondaryText: '0',
                        },
                    )
                    .withToken('FormIntent_apl')
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Welcome to the form. What day are you recording for?',
                reprompts: 'For what day?',
                elicitsSlot: 'date',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'date',
                    slotNumber: 1,
                    slotValues: (v) => {
                        return v.slot_one === undefined;
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
        ]);
    });

    describe('repeat current question with APL touch on the question', () => {
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
                    slotNumber: 1,
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
                request: new AplUserEventRequestBuilder(skillSettings)
                    .withArguments(
                        'ListItemSelected',
                        1,
                        {
                            primaryText: `Do you know the value of pi?`,
                            secondaryText: '1',
                        },
                    )
                    .withToken('FormIntent_apl')
                    .withInterfaces({ apl: true })
                    .build(),
                says: '1. Do you know the value of pi?',
                reprompts: 'Please say yes or no.',
                elicitsSlot: 'slot_one',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_one',
                    slotValues: (v) => {
                        return v.date === today && v.slot_one === undefined;
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
        ]);
    });

    describe('Skip date with APL touch', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'FormIntent').build(),
                says: 'Welcome to the form. What day are you recording for?',
                reprompts: 'For what day?',
                elicitsSlot: 'date',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'date',
                    slotNumber: 1,
                },
                shouldEndSession: false,
            },
            {
                request: new AplUserEventRequestBuilder(skillSettings)
                    .withArguments(
                        'ListItemSelected',
                        1,
                        {
                            primaryText: 'Next : Do you know the value of pi?',
                            secondaryText: '1',
                        },
                    )
                    .withToken('FormIntent_apl')
                    .build(),
                says: '1. Do you know the value of pi?',
                reprompts: 'Please say yes or no.',
                elicitsSlot: 'slot_one',
                hasAttributes: {
                    intentName: 'FormIntent',
                    slotName: 'slot_one',
                    slotNumber: 2,
                    slotValues: (v) => {
                        return v.date === undefined;
                    },
                },
                shouldEndSession: false,
            },
        ]);
    });
});
