import { type StoryObj } from '@storybook/react';
import { type ComponentProps } from 'react';
import React from 'react';
import MetadataSidebarRedesign, { MetadataSidebarRedesignProps } from '../MetadataSidebarRedesign';
import ContentSidebar from '../ContentSidebar';

const defaultArgs: ComponentProps<typeof MetadataSidebarRedesign> = {
    fileId: global.FILE_ID,
    isBoxAiSuggestionsFeatureEnabled: true,
    isFeatureEnabled: true,
    onError: (error, code, context) => console.error('Error:', error, code, context),
    selectedTemplateKey: '',
    templateFilters: [],
};

export default {
    title: 'Elements/ContentSidebar/MetadataSidebarRedesign',
    component: MetadataSidebarRedesign,
    args: defaultArgs,
};

const mockLogger = {
    onReadyMetric: ({ endMarkName }) => {
        console.log(`Logger: onReadyMetric called with endMarkName: ${endMarkName}`);
    },
};

const mockFeatures = {
    'metadata.redesign.enabled': true,
};

const Template = (args: MetadataSidebarRedesignProps) => {
    return (
        <ContentSidebar
            token={global.TOKEN}
            metadataSidebarProps={{
                ...args,
            }}
            hasMetadata={true}
            features={mockFeatures}
            fileId={global.FILE_ID}
            logger={mockLogger}
        />
    );
};

const Default: StoryObj<typeof MetadataSidebarRedesign> = {
    render: Template,
    args: { ...defaultArgs },
};

const fileIdWithNoMetadata = '416047501580';

export const EmptyStateWithBoxAiEnabled: StoryObj<typeof MetadataSidebarRedesign> = {
    ...Default,
    args: {
        ...Default.args,
        fileId: fileIdWithNoMetadata,
    },
};

export const EmptyStateWithBoxAiDisabled: StoryObj<typeof MetadataSidebarRedesign> = {
    ...Default,
    args: {
        ...Default.args,
        isBoxAiSuggestionsFeatureEnabled: false,
        fileId: fileIdWithNoMetadata,
    },
};
