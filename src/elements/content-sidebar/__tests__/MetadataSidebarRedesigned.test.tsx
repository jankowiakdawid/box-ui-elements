import React from 'react';
import { IntlProvider } from 'react-intl';
import { screen, render } from '@testing-library/react';
import MetadataSidebarRedesign from '../MetadataSidebarRedesign';
import { FIELD_PERMISSIONS_CAN_UPLOAD } from '../../../constants';

jest.unmock('react-intl');
jest.unmock('lodash');

jest.mock('../../common/api-context', () => Component => {
    return Component;
});
jest.mock('../../common/logger', () => ({
    withLogger: jest.fn(() => Component => Component),
}));
jest.mock('../../common/error-boundary', () => ({
    withErrorBoundary: jest.fn(() => Component => Component),
}));

jest.mock('lodash/flow', () => {
    return () => component => {
        return component;
    };
});

const mockAPI = {
    getFile: jest.fn((id, successCallback) => {
        successCallback({ id, [FIELD_PERMISSIONS_CAN_UPLOAD]: true });
    }),
    getMetadata: jest.fn((file, successCallback) => {
        successCallback({ editors: [], templates: [] });
    }),
};
const api = {
    getFileAPI: jest.fn().mockReturnValue(mockAPI),
    getMetadataAPI: jest.fn().mockReturnValue(mockAPI),
};

describe('elements/content-sidebar/Metadata/MetadataSidebarRedesigned', () => {
    const renderComponent = (props = {}) => {
        render(<MetadataSidebarRedesign {...props} />, {
            wrapper: ({ children }: { children: React.ReactNode }) => (
                <IntlProvider locale="en">{children}</IntlProvider>
            ),
        });
    };

    test('should render title', () => {
        renderComponent({ api });
        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeVisible();
    });

    test('should call fetch file', () => {
        renderComponent({ api });
        expect(api.getFileAPI).toHaveBeenCalled();
    });

    test('empty state with AI enabled', () => {
        const isFeatureEnabled = true;

        renderComponent({ api, isFeatureEnabled });
        expect(screen.getByRole('heading', { level: 2, name: 'Autofill Metadata with Box AI' })).toBeVisible();
        expect(
            screen.getByText(
                'Use the power of Box AI to quickly capture document metadata, with ever-increasing accuracy.',
            ),
        );
    });

    test('empty state with AI disabled', () => {
        const isFeatureEnabled = false;

        renderComponent({ api, isFeatureEnabled });
        expect(screen.getByRole('heading', { level: 2, name: 'Add Metadata Templates' })).toBeVisible();
        expect(screen.getByText('Add Metadata to your file to support business operations, workflows, and more!'));
    });
});
