import { Card, Group, Text, Image } from "@mantine/core";
import React from "react";
import HoverButton from "./HoverButton";
import { phoneMaxWidth } from "./Game";

export interface CustomGameModalProps {
  customModalOpen: () => void;
  showText?: boolean;
}

const CustomGameButton = (props: CustomGameModalProps) => {
  const { customModalOpen, showText=true } = props;

  return (
    <HoverButton onTap={() => customModalOpen()}>
      <Card shadow="md" radius="lg" p="sm">
        <Group gap="sm" justify="center">
          <Image src={"images/custom-icon.svg"} alt="custom-game" />
          {showText && (
            <Text
              fw={700}
              size={window.innerWidth > phoneMaxWidth ? "md" : "sm"}
              c="gray.1"
            >
              CUSTOM GAME
            </Text>
          )}
        </Group>
      </Card>
    </HoverButton>
  );
};

export default CustomGameButton;
