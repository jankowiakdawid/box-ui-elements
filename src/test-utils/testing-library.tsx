import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';

// Data Providers
import { TooltipProvider } from '@box/blueprint-web';
import { IntlProvider } from 'react-intl';
import { AutofillContextProvider, MetadataTemplateField } from '@box/metadata-editor';

import { FeatureProvider } from '../elements/common/feature-checking';

jest.unmock('react-intl');

const Wrapper = ({
    children,
    features = {},
    fetchSuggestions = () => Promise.resolve([]),
    isAiSuggestionsFeatureEnabled = false,
}) => (
    <AutofillContextProvider
        fetchSuggestions={fetchSuggestions}
        isAiSuggestionsFeatureEnabled={isAiSuggestionsFeatureEnabled}
    >
        <FeatureProvider features={features}>
            <TooltipProvider>
                <IntlProvider locale="en">{children}</IntlProvider>
            </TooltipProvider>
        </FeatureProvider>
    </AutofillContextProvider>
);

type RenderConnectedOptions = Omit<RenderOptions, 'wrapper'> & {
    wrapperProps?: Record<string, unknown>;
};

const renderConnected = (element, options: RenderConnectedOptions = {}) =>
    render(element, { wrapper: props => <Wrapper {...props} {...options.wrapperProps} />, ...options });

export * from '@testing-library/react';
export { renderConnected as render };
