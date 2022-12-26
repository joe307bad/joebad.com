import { ComponentMeta, ComponentStory } from "@storybook/react";
import BottomDrawer from "./BottomDrawer";

export default {
  title: "Components/BottomDrawer",
  component: BottomDrawer,
  argTypes: {
    children: {
      control: { type: "text" },
    },
  },
} as ComponentMeta<typeof BottomDrawer>;

const Template: ComponentStory<typeof BottomDrawer> = (args) => (
  <BottomDrawer />
);

export const Default = Template.bind({});
