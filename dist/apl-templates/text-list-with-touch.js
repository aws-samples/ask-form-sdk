"use strict";
/* tslint:disable: no-invalid-template-strings */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextListWithTouch = void 0;
exports.TextListWithTouch = {
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
//# sourceMappingURL=text-list-with-touch.js.map