import React from "react";
import HoverButton from "./HoverButton";
import { Anchor, Card, Group, Text } from "@mantine/core";
import { IconCoffee } from "@tabler/icons-react";
import IconHoverButton from "./IconHoverButton";

const CoffeeButton = () => {
  return (
      <IconHoverButton url='https://www.buymeacoffee.com/karimk' onTap={() => {return}} icon={<IconCoffee size={16} />} text='BUY US A COFFEE'/>
  );
};

export default CoffeeButton;
