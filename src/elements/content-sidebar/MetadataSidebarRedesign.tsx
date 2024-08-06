/**
 * @file Redesigned Metadata sidebar component
 * @version 2.0
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { FormattedMessage } from 'react-intl';
import { MetadataEmptyState } from '@box/metadata-editor';
import messages from '../common/messages';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import {
    // FIELD_IS_EXTERNALLY_OWNED,
    // FIELD_PERMISSIONS,
    // FIELD_PERMISSIONS_CAN_UPLOAD,
    // IS_ERROR_DISPLAYED,
    ORIGIN_METADATA_SIDEBAR_REDESIGN,
} from '../../constants';
import './MetadataSidebarRedesign.scss';

// import { useEffect, useState, useCallback } from 'react';
// import getProp from 'lodash/get';
// import type { MessageDescriptor } from 'react-intl';
// import { normalizeTemplates } from '../../features/metadata-instance-editor/metadataUtil';
// import { isUserCorrectableError } from '../../utils/error';

// import type { ElementsXhrError } from '../../common/types/api';
// import type { MetadataEditor, MetadataTemplate } from '../../common/types/metadata';
// import type { BoxItem } from '../../common/types/core';

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR_REDESIGN}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

function MetadataSidebarRedesign({ isFeatureEnabled }) {
    // function MetadataSidebarRedesign({ api, fileId, isFeatureEnabled, onError, selectedTemplateKey, templateFilters }) {

    // const [editors, setEditors] = useState<Array<MetadataEditor>>([]);
    // const [error, setError] = useState<MessageDescriptor>(undefined);
    // const [file, setFile] = useState<BoxItem>(undefined);
    // const [templates, setTemplates] = useState<Array<MetadataTemplate>>([]);

    // const onApiError = useCallback(
    //     (err: ElementsXhrError, code: string) => {
    //         const { status } = err;
    //         const isValidError = isUserCorrectableError(status);
    //         setError(messages.sidebarMetadataEditingErrorContent);
    //         // MetadataSidebar.js
    //         // this.setState({
    //         //  error: messages.sidebarMetadataEditingErrorContent,
    //         //  isLoading: false,
    //         //  ...newState,
    //         // });
    //         onError(error, code, { error, [IS_ERROR_DISPLAYED]: isValidError });
    //     },
    //     [onError, error],
    // );

    // const fetchMetadataErrorCallback = useCallback(
    //     (e: ElementsXhrError, code: string) => {
    //         onApiError(e, code);
    //         // MetadataSidebar.js
    //         // onApiError(e, code, {
    //         //     editors: undefined,
    //         //     error: messages.sidebarMetadataFetchingErrorContent,
    //         //     templates: undefined,
    //         // });
    //     },
    //     [onApiError],
    // );

    // const fetchMetadataSuccessCallback = useCallback(
    //     ({ fetchedEditors, fetchedTemplates }) => {
    //         setEditors(fetchedEditors.slice(0));
    //         setError(undefined);
    //         setTemplates(normalizeTemplates(fetchedTemplates, selectedTemplateKey, templateFilters));
    //     },
    //     [selectedTemplateKey, templateFilters],
    // );

    // const fetchMetadata = useCallback(
    //     fetchedFile => {
    //         if (!fetchedFile) return;

    //         api.getMetadataAPI(false).getMetadata(
    //             fetchedFile,
    //             fetchMetadataSuccessCallback,
    //             fetchMetadataErrorCallback,
    //             isFeatureEnabled,
    //             { refreshCache: true },
    //         );
    //     },
    //     [api, fetchMetadataErrorCallback, fetchMetadataSuccessCallback, isFeatureEnabled],
    // );

    // const fetchFileErrorCallback = (e: ElementsXhrError, code: string) => {
    //     onApiError(e, code);
    //     // MetadataSidebar.js
    //     // onApiError(e, code, { error: messages.sidebarFileFetchingErrorContent, file: undefined });
    // };

    // const fetchFileSuccessCallback = (fetchedFile: BoxItem) => {
    //     const currentCanUpload = getProp(file, FIELD_PERMISSIONS_CAN_UPLOAD, false);
    //     const newCanUpload = getProp(fetchedFile, FIELD_PERMISSIONS_CAN_UPLOAD, false);
    //     const shouldFetchMetadata = !file || currentCanUpload !== newCanUpload;
    //     setFile(fetchedFile);
    //     if (shouldFetchMetadata) fetchMetadata(fetchedFile);
    // };

    // const fetchFile = () => {
    //     api.getFileAPI().getFile(fileId, fetchFileSuccessCallback, fetchFileErrorCallback, {
    //         fields: [FIELD_IS_EXTERNALLY_OWNED, FIELD_PERMISSIONS],
    //         refreshCache: true,
    //     });
    // };

    // useEffect(() => {
    //     fetchFile();
    // }, []);

    // const showEditor = !!file && !!templates && !!editors;
    // const showEmptyState = showEditor && editors && editors.length === 0;
    const showEmptyState = true;

    return (
        <div className="bcs-MetadataSidebarRedesign">
            <h3>
                <FormattedMessage {...messages.sidebarMetadataTitle} />
            </h3>
            <hr />
            {showEmptyState && (
                <MetadataEmptyState level={'file'} isBoxAiSuggestionsFeatureEnabled={isFeatureEnabled} />
            )}
        </div>
    );
}

export { MetadataSidebarRedesign as MetadataSidebarRedesignComponent };
export default flow([
    withLogger(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withErrorBoundary(ORIGIN_METADATA_SIDEBAR_REDESIGN),
    withAPIContext,
])(MetadataSidebarRedesign);
