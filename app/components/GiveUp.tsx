import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

export interface GiveUpProps {
  giveUpHandler: () => void;
}

const GiveUp = (props: GiveUpProps) => {
  const { giveUpHandler } = props;
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
    <Button
      onClick={open}
      size="md"
      color="red.6"
      fw={700}
      variant="filled"
    >
      GIVE UP
    </Button>
    <Modal radius='lg' opened={opened} onClose={close} withCloseButton={false} centered>
      <Stack align="center" justify="center">
        <Text size="xl" fw={700} ta="center">Are you sure you want to give up?</Text>
        <Group align="center" justify="center">
          <Button onClick={giveUpHandler} size="md" color="red.7" fw={700} variant="filled">
            YES
          </Button>
          <Button onClick={close} size="md" color='gray.7' fw={700} variant="filled">
            NO
          </Button>
        </Group>
      </Stack>
    </Modal>
    </>
  );
};

export default GiveUp;
