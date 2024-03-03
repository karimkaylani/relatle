import React from "react";
import HoverButton from "./HoverButton";
import { Anchor, Card, Group, Text } from "@mantine/core";
import { IconCoffee } from "@tabler/icons-react";

const CoffeeButton = () => {
  return (
    <Anchor href="https://www.buymeacoffee.com/karimk" target="_blank">
      <HoverButton
        onTap={() => {
          return;
        }}
      >
        <Card shadow="md" radius="lg" p="xs">
          <Group gap="4px" justify="center">
            <IconCoffee size={16} />
            <Text size="sm" fw={700} c="gray.1">
              BUY US A COFFEE
            </Text>
          </Group>
        </Card>
      </HoverButton>
    </Anchor>
  );
};

export default CoffeeButton;
