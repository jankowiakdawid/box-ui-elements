/**
 * @file Redesigned Metadata sidebar component
 * @author Box
 */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import { MetadataEmptyState } from '@box/metadata-editor';
import type { MessageDescriptor } from 'react-intl';
import messages from '../common/messages';
import { normalizeTemplates } from '../../features/metadata-instance-editor/metadataUtil';
import { isUserCorrectableError } from '../../utils/error';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { mark } from '../../utils/performance';
import { EVENT_JS_READY } from '../common/logger/constants';
import API from '../../api';
import {
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_PERMISSIONS,
    FIELD_PERMISSIONS_CAN_UPLOAD,
    IS_ERROR_DISPLAYED,
    ORIGIN_METADATA_SIDEBAR_REDESIGN,
} from '../../constants';
import type { ElementsXhrError, ErrorContextProps } from '../../common/types/api';
import type { BoxItem } from '../../common/types/core';
import type { MetadataEditor, MetadataTemplate } from '../../common/types/metadata';
import type { WithLoggerProps } from '../../common/types/logging';

import './MetadataSidebarRedesign.scss';

interface ExternalProps {
    isBoxAiSuggestionsFeatureEnabled: boolean;
    isFeatureEnabled: boolean;
    selectedTemplateKey?: string;
    templateFilters?: Array<string> | string;
}

interface PropsWithoutContext extends ExternalProps {
    elementId: string;
    fileId: string;
    hasSidebarInitialized?: boolean;
}

// For some reason, when changing this type to an interface, the MetadataSidebarRedesign component throws an error on the onError prop.
export type MetadataSidebarRedesignProps = {
    api: API;
} & PropsWithoutContext &
    ErrorContextProps &
    WithLoggerProps;

interface Metadata {
    editors: Array<MetadataEditor>;
    templates: Array<MetadataTemplate>;
}

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR_REDESIGN}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

const MetadataSidebarRedesign: React.FunctionComponent<MetadataSidebarRedesignProps> = ({
    api,
    fileId,
    isBoxAiSuggestionsFeatureEnabled,
    isFeatureEnabled,
    onError,
    selectedTemplateKey,
    templateFilters,
}) => {
    const [editors, setEditors] = React.useState<Array<MetadataEditor>>([]);
    const [error, setError] = React.useState<MessageDescriptor>(undefined);
    const [file, setFile] = React.useState<BoxItem>(undefined);
    const [templates, setTemplates] = React.useState<Array<MetadataTemplate>>([]);

    const onApiError = (err: ElementsXhrError, code: string) => {
        const { status } = err;
        const isValidError = isUserCorrectableError(status);
        onError(error, code, { error, [IS_ERROR_DISPLAYED]: isValidError });
    };
    const fetchMetadataErrorCallback = (e: ElementsXhrError, code: string) => {
        onApiError(e, code);
        setEditors(null);
        setError(messages.sidebarMetadataFetchingErrorContent);
        setTemplates(null);
    };

    const fetchMetadataSuccessCallback = ({ editors: fetchedEditors, templates: fetchedTemplates }: Metadata) => {
        setEditors(fetchedEditors);
        setError(undefined);
        setTemplates(normalizeTemplates(fetchedTemplates, selectedTemplateKey, templateFilters));
    };

    const fetchMetadata = (fetchedFile: BoxItem) => {
        if (!fetchedFile) return;

        api.getMetadataAPI(false).getMetadata(
            fetchedFile,
            fetchMetadataSuccessCallback,
            fetchMetadataErrorCallback,
            isFeatureEnabled,
            { refreshCache: true },
        );
    };

    const fetchFileErrorCallback = (e: ElementsXhrError, code: string) => {
        onApiError(e, code);
        setError(messages.sidebarFileFetchingErrorContent);
        setFile(null);
    };

    const fetchFileSuccessCallback = (fetchedFile: BoxItem) => {
        const currentCanUpload = getProp(file, FIELD_PERMISSIONS_CAN_UPLOAD, false);
        const newCanUpload = getProp(fetchedFile, FIELD_PERMISSIONS_CAN_UPLOAD, false);
        const shouldFetchMetadata = !file || currentCanUpload !== newCanUpload;
        setFile(fetchedFile);
        if (shouldFetchMetadata) fetchMetadata(fetchedFile);
    };

    const fetchFile = () => {
        api.getFileAPI().getFile(fileId, fetchFileSuccessCallback, fetchFileErrorCallback, {
            fields: [FIELD_IS_EXTERNALLY_OWNED, FIELD_PERMISSIONS],
            refreshCache: true,
        });
    };

    React.useEffect(() => {
        fetchFile();
    }, []);

    const showEditor = file && templates && editors;
    const showEmptyState = showEditor && editors && editors.length === 0;

    return (
        <div className="bcs-MetadataSidebarRedesign bcs-content">
            <h3>
                <FormattedMessage {...messages.sidebarMetadataTitle} />
            </h3>
            <hr />
            {showEmptyState && (
                <MetadataEmptyState
                    level={'file'}
                    isBoxAiSuggestionsFeatureEnabled={isBoxAiSuggestionsFeatureEnabled}
                />
            )}
        </div>
    );
};

export { MetadataSidebarRedesign as MetadataSidebarRedesignComponent };
export default flow([
    withLogger(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withErrorBoundary(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withAPIContext,
])(MetadataSidebarRedesign);
