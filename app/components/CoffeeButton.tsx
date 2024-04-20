import React from "react";
import HoverButton from "./HoverButton";
import { Anchor, Card, Group, Text } from "@mantine/core";
import { IconCoffee, IconMug } from "@tabler/icons-react";
import IconHoverButton from "./IconHoverButton";

export interface CoffeeButtonProps {
  caps?: boolean;
}

const CoffeeButton = (props: CoffeeButtonProps) => {
  const { caps=false } = props;
  return (
    <IconHoverButton
      url="https://www.buymeacoffee.com/karimk"
      onTap={() => {
        return;
      }}
      icon={<IconMug size={16} />}
      text={caps ? "BUY US A COFFEE" : "Buy Us A Coffee"}
    />
  );
};

export default CoffeeButton;
