import React, { ReactNode } from "react";
import HoverButton from "./HoverButton";
import { Card, Group, Text } from "@mantine/core";
import { phoneMaxWidth } from "./Game";
import { white } from "../colors";

export interface IconHoverButtonProps {
  onTap: () => void;
  icon: ReactNode;
  text: string;
  textSize?: string;
  showText?: boolean;
  textColor?: string;
  bg?: string;
  centered?: boolean;
}

const IconHoverButton = (props: IconHoverButtonProps) => {
  const {
    onTap,
    icon,
    text,
    textSize = window.innerWidth > phoneMaxWidth ? "md" : "sm",
    showText = true,
    textColor = white,
    bg = null,
    centered = true,
  } = props;
  return (
    <HoverButton onTap={onTap}>
      <Card shadow="md" radius="lg" p={showText ? "sm" : "xs"} bg={bg ? bg : undefined}>
        <Group gap="6px" justify={centered ? "center" : "flex-start"} wrap="nowrap">
          {icon}
          {showText && (
            <Text fw={700} size={textSize} c={textColor} ta={centered ? "center" : "left"}>
              {text}
            </Text>
          )}
        </Group>
      </Card>
    </HoverButton>
  );
};

export default IconHoverButton;
