import { ComponentMeta, ComponentStory } from '@storybook/react';
import MostRecentMovie from '../MostRecentMovie';

export default {
    title: 'Components/MostRecentMovie',
    component: MostRecentMovie,
    argTypes: {
        children: {
            control: { type: 'text' },
        },
    },
} as ComponentMeta<typeof MostRecentMovie>;

const Template: ComponentStory<typeof MostRecentMovie> = (args) => <MostRecentMovie {...args} />;

export const Default = Template.bind({});
Default.args = {
    title: "A Christmas Carol",
    thumbnail: "https://picsum.photos/seed/picsum/200/300",
    description: "Hey there"
};