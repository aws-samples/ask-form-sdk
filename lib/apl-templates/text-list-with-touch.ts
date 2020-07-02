/* tslint:disable: no-invalid-template-strings */

import { AplTextListTemplate } from './apl-template-type';

export const TextListWithTouch: AplTextListTemplate = {
    type: 'APL',
    version: '1.3',
    import: [
        {
            name: 'alexa-layouts',
            version: '1.1.0',
        },
    ],
    mainTemplate: {
        parameters: [
            'textListData',
        ],
        items: [
            {
                type: 'AlexaTextList',
                theme: '${viewport.theme}',
                headerTitle: '${textListData.headerTitle}',
                headerSubtitle: '${textListData.headerSubtitle}',
                headerAttributionImage: '${textListData.headerAttributionImage}',
                headerDivider: true,
                headerBackButton: false,
                headerBackButtonAccessibilityLabel: 'back',
                headerBackgroundColor: 'transparent',
                touchForward: true,
                backgroundColor: 'transparent',
                hideOrdinal: true,
                backgroundImageSource: '${textListData.backgroundImageSource}',
                backgroundScale: 'best-fill',
                backgroundAlign: 'center',
                backgroundBlur: false,
                primaryAction: {
                    type: 'SendEvent',
                    arguments: [
                        'ListItemSelected',
                        '${ordinal}',
                        '${textListData.listItemsToShow[ordinal-1]}',
                    ],
                },
                listItems: '${textListData.listItemsToShow}',
            },
        ],
    },
};
