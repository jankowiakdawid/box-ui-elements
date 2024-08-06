/**
 * @file Redesigned Metadata sidebar component
 * @version 2.0
 */
import * as React from 'react';
import flow from 'lodash/flow';
import { FormattedMessage } from 'react-intl';
import { MetadataEmptyState } from '@box/metadata-editor';
import { useEffect, useState } from 'react';
import getProp from 'lodash/get';
import type { MessageDescriptor } from 'react-intl';
import messages from '../common/messages';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import {
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_PERMISSIONS,
    FIELD_PERMISSIONS_CAN_UPLOAD,
    IS_ERROR_DISPLAYED,
    ORIGIN_METADATA_SIDEBAR_REDESIGN,
} from '../../constants';
import './MetadataSidebarRedesign.scss';

import { normalizeTemplates } from '../../features/metadata-instance-editor/metadataUtil';
import { isUserCorrectableError } from '../../utils/error';

import type { ElementsXhrError } from '../../common/types/api';
import type { MetadataEditor, MetadataTemplate } from '../../common/types/metadata';
import type { BoxItem } from '../../common/types/core';

const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR_REDESIGN}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

function MetadataSidebarRedesign({ api, fileId, isFeatureEnabled, onError, selectedTemplateKey, templateFilters }) {
    const [editors, setEditors] = useState<Array<MetadataEditor>>([]);
    const [error, setError] = useState<MessageDescriptor>(undefined);
    const [file, setFile] = useState<BoxItem>(undefined);
    const [templates, setTemplates] = useState<Array<MetadataTemplate>>([]);

    const onApiError = (err: ElementsXhrError, code: string) => {
        const { status } = err;
        const isValidError = isUserCorrectableError(status);
        setError(messages.sidebarMetadataEditingErrorContent);
        onError(error, code, { error, [IS_ERROR_DISPLAYED]: isValidError });
    };

    const fetchMetadataErrorCallback = (e: ElementsXhrError, code: string) => {
        onApiError(e, code);

        setEditors(undefined);
        setError(messages.sidebarMetadataFetchingErrorContent);
        setTemplates(undefined);

        // onApiError(e, code);
        // MetadataSidebar.js
        // onApiError(e, code, {
        //     editors: undefined,
        //     error: messages.sidebarMetadataFetchingErrorContent,
        //     templates: undefined,
        // });
    };

    const fetchMetadataSuccessCallback = ({ fetchedEditors, fetchedTemplates }) => {
        setEditors(fetchedEditors ?? []); // fetchedEditors and fetchedTemplates are undefined now
        setError(undefined);
        setTemplates(normalizeTemplates(fetchedTemplates ?? [], selectedTemplateKey, templateFilters));
    };

    const fetchMetadata = fetchedFile => {
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
        setFile(undefined);
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

    useEffect(() => {
        fetchFile();
    }, []);

    const showEditor = !!file && !!templates && !!editors;
    const showEmptyState = showEditor && editors && editors.length === 0;

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
