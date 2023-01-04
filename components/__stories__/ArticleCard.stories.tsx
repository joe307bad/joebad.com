import { ComponentMeta, ComponentStory } from '@storybook/react';
import ArticleCard from '../ArticleCard';

export default {
    title: 'Components/ArticleCard',
    component: ArticleCard,
    argTypes: {
        children: {
            control: { type: 'text' },
        },
    },
} as ComponentMeta<typeof ArticleCard>;

const Template: ComponentStory<typeof ArticleCard> = (args) => <ArticleCard {...args} />;

export const Default = Template.bind({});
Default.args = {
    title: "Hey there"
};

export const WithIcon = Template.bind({});
WithIcon.args = {
    title: "Another thinger"
};