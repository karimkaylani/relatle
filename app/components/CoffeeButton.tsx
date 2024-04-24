import React from "react";
import HoverButton from "./HoverButton";
import { Anchor, Card, Group, Text } from "@mantine/core";
import { IconCoffee, IconMug } from "@tabler/icons-react";
import IconHoverButton from "./IconHoverButton";
import { white } from "../colors";


const CoffeeButton = () => {
  return (
    <IconHoverButton
      onTap={() => {
        window.open("https://www.buymeacoffee.com/karimk", "_blank");
      }}
      icon={<IconMug size={16} color={white}/>}
      text={"Buy Us A Coffee"}
    />
  );
};

export default CoffeeButton;
