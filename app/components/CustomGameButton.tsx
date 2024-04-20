import { Card, Group, Text, Image } from "@mantine/core";
import React from "react";
import HoverButton from "./HoverButton";
import { phoneMaxWidth } from "./Game";

export interface CustomGameModalProps {
  customModalOpen: () => void;
  showText?: boolean;
  caps?: boolean;
}

const CustomGameButton = (props: CustomGameModalProps) => {
  const { customModalOpen, showText=true, caps=false } = props;

  return (
    <Card onClick={customModalOpen} shadow="md" radius="lg" p="sm">
     <HoverButton onTap={() => {return}}>
        <Group gap="sm" justify="center">
          <Image src={"images/custom-icon.svg"} alt="custom-game" />
          {showText && (
            <Text
              fw={700}
              size={window.innerWidth > phoneMaxWidth ? "md" : "sm"}
              c="gray.1"
            >
              {caps ? "CUSTOM GAME" : "Custom Game"}
            </Text>
          )}
        </Group>
      </HoverButton>
    </Card>
  );
};

export default CustomGameButton;
