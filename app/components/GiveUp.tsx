import { Button, Group, Modal, Stack, Text, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

export interface GiveUpProps {
  giveUpHandler: () => void;
  is_custom: boolean;
}

const GiveUp = (props: GiveUpProps) => {
  const { giveUpHandler, is_custom } = props;
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button onClick={open} size="md" color="red.6" fw={700} variant="filled">
        Give Up
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        padding="lg"
        radius="lg"
      >
        <Stack align="center" justify="center" gap="xl">
          <Stack align="center" justify="center">
            <Text size="24px" c="gray.1" fw={700} ta="center">
              Are you sure?
            </Text>
            <Text ta="center" c="gray.1">
              {`If you give up, it will show in your shared results${
                !is_custom ? ", reset your streak, " : " "
              }and you will see the shortest path.`}
            </Text>
          </Stack>
          <Image w={158} src="images/give-up.png" alt="Give Up" />
          <Group align="center" justify="center">
            <Button
              onClick={giveUpHandler}
              size="md"
              color="red.6"
              fw={700}
              variant="filled"
            >
              Yes, Give Up
            </Button>
            <Button
              onClick={close}
              size="md"
              color="gray.7"
              fw={700}
              variant="filled"
            >
              No, Keep Trying
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default GiveUp;
