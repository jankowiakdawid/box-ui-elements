import React from 'react';
import { IntlProvider } from 'react-intl';

import { screen, render } from '@testing-library/react';

import MetadataSidebarRedesign from '../MetadataSidebarRedesign';

jest.unmock('react-intl');

describe('elements/content-sidebar/Metadata/MetadataSidebarRedesigned', () => {
    const renderComponent = (props = {}) =>
        render(<MetadataSidebarRedesign {...props} />, {
            wrapper: ({ children }: { children: React.ReactNode }) => (
                <IntlProvider locale="en-US">{children}</IntlProvider>
            ),
        });

    test('should render title', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeVisible();
    });

    // describe('componentDidMount()', () => {
    //     test('should call fetch file', async () => {
    //         const getFile = jest.fn();
    //         const api = {
    //             getFileAPI: jest.fn().mockReturnValue({
    //                 getFile,
    //             }),
    //         };
    //         renderComponent({ api });

    //         await waitFor(() => {
    //             expect(api.getFileAPI).toHaveBeenCalled();
    //             expect(getFile).toHaveBeenCalled();
    //         });
    //     });
    // });
});
