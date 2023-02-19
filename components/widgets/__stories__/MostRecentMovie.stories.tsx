import { ComponentMeta, ComponentStory } from "@storybook/react";
import MostRecentMovie from "../MostRecentMovie";

export default {
  title: "Components/MostRecentMovie",
  component: MostRecentMovie,
  argTypes: {
    children: {
      control: { type: "text" },
    },
  },
} as ComponentMeta<typeof MostRecentMovie>;

const Template: ComponentStory<typeof MostRecentMovie> = (args) => (
  <MostRecentMovie {...args} />
);

export const Default = Template.bind({});
Default.args = {
  mostRecentMovie: {
    name: "@joe307bad using showly",
    date: "Jan. 4th",
    description: "Hey there",
  },
};
