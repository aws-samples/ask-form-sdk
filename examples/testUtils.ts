import { AlexaTest, SkillSettings } from 'ask-sdk-test';

import { handler as skillHandler } from './index';

//
export const  checkEqualityOfListItemsToShow = (expectedListItems: any, actualListItems: any): boolean => {
    if (expectedListItems !== undefined && actualListItems !== undefined && actualListItems.length >= expectedListItems.length) {
        for (let i = 0; i < expectedListItems.length; i++) {
            if ((expectedListItems[i].primaryText !== actualListItems[i].primaryText) || (expectedListItems[i].secondaryText !== actualListItems[i].secondaryText)) {
                console.log(`Item ${i} is not satisfying the condition. Actual - ${JSON.stringify(actualListItems[i])} and expected ${JSON.stringify(expectedListItems[i])} `);
                return false;
            }
        }
        return true;
    }
    console.log('Either the expect or actual List items are undefined or actual List item is shorter than the expected list item.');
    return false;
};

// Date help functions
export const getDate = (date: Date) => {
    return date.toISOString().substring(0, 10);
};

export const addDays = (date: Date, days: number): Date => {
    return new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
};

// initialize the testing framework
export const skillSettings: SkillSettings = {
    appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    userId: 'amzn1.ask.account.VOID',
    deviceId: 'amzn1.ask.device.VOID',
    locale: 'en-AU',
};

export const alexaTest = new AlexaTest(skillHandler, skillSettings);

export const today = getDate(new Date());
