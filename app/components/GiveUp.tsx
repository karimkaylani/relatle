import { Button, Group, Modal, Stack, Text, Image, darken } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { dk_red, gray7, red, white } from "../colors";
import OutlineButton from "./OutlineButton";
import { IconFlag } from "@tabler/icons-react";

export interface GiveUpProps {
  giveUpHandler: () => void;
  is_custom: boolean;
}

const GiveUp = (props: GiveUpProps) => {
  const { giveUpHandler, is_custom } = props;
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <OutlineButton icon={<IconFlag size={18}/>} text="Give Up" color={red} onClick={open} />
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
            <Text size="24px" c={white} fw={700} ta="center">
              Are you sure?
            </Text>
            <Text ta="center" c={white}>
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
              color={red}
              fw={700}
              variant="filled"
            >
              Yes, Give Up
            </Button>
            <Button
              onClick={close}
              size="md"
              color={gray7}
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
