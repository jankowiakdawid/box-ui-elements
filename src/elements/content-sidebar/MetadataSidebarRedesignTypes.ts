import API from '../../api';
import type { WithLoggerProps } from '../../common/types/logging';
import type { ErrorContextProps } from '../../common/types/api';
import type { MetadataEditor, MetadataTemplate } from '../../common/types/metadata';

export type ExternalProps = {
    isFeatureEnabled: boolean;
    selectedTemplateKey?: string;
    templateFilters?: Array<string> | string;
};

export type PropsWithoutContext = {
    elementId: string;
    fileId: string;
    hasSidebarInitialized?: boolean;
} & ExternalProps;

export type Props = {
    api: API;
} & PropsWithoutContext &
    ErrorContextProps &
    WithLoggerProps;

export type Metadata = {
    editors: Array<MetadataEditor>;
    templates: Array<MetadataTemplate>;
};
