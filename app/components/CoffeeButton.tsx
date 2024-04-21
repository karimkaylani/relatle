import React from "react";
import HoverButton from "./HoverButton";
import { Anchor, Card, Group, Text } from "@mantine/core";
import { IconCoffee, IconMug } from "@tabler/icons-react";
import IconHoverButton from "./IconHoverButton";


const CoffeeButton = () => {
  return (
    <IconHoverButton
      url="https://www.buymeacoffee.com/karimk"
      onTap={() => {
        return;
      }}
      icon={<IconMug size={16} color="white"/>}
      text={"Buy Us A Coffee"}
    />
  );
};

export default CoffeeButton;
