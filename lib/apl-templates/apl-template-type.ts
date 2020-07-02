export interface Import {
    name: string;
    version: string;
}

export interface PrimaryAction {
    type: string;
    arguments: string[];
}

export interface Item {
    type: string;
    theme: string;
    headerTitle: string;
    headerSubtitle: string;
    headerAttributionImage?: string;
    headerDivider: boolean;
    headerBackButton: boolean;
    headerBackButtonAccessibilityLabel: string;
    headerBackgroundColor?: string;
    touchForward: boolean;
    backgroundColor: string;
    hideOrdinal: boolean;
    backgroundImageSource: string;
    backgroundScale: string;
    backgroundAlign: string;
    backgroundBlur: boolean;
    primaryAction?: PrimaryAction;
    listItems: string;
}

export interface MainTemplate {
    parameters: string[];
    items: Item[];
}

export interface AplTextListTemplate {
    type: string;
    version: string;
    import: Import[];
    mainTemplate: MainTemplate;
}
