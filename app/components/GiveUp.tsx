import { Button, Group, Modal, Stack, Text, Image } from "@mantine/core";
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
      <Button onClick={open} size="md" color="red.6" fw={700} variant="filled">
        GIVE UP
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        padding="xl"
        radius="lg"
      >
        <Stack align="center" justify="center" gap='xl'>
          <Stack align='center' justify="center">
            <Text size="24px" c='gray.1' fw={700} ta="center">
              Are you sure?
            </Text>
            <Text ta='center' c='gray.1'>
              {"If you give up, it will show in your shared results and you will see the shortest path."}
            </Text>
          </Stack>
          <Image w={158} src="images/give-up.png" alt='Give Up'/>
          <Group align="center" justify="center">
            <Button
              onClick={giveUpHandler}
              size="md"
              color="red.6"
              fw={700}
              variant="filled"
            >
              YES, GIVE UP
            </Button>
            <Button
              onClick={close}
              size="md"
              color="gray.7"
              fw={700}
              variant="filled"
            >
              NO, KEEP PLAYING
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default GiveUp;
