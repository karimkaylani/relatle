import { Group, Modal, Stack, Text } from "@mantine/core";
import React from "react";
import { green, white } from "../colors";
import RelatleButton from "./RelatleButton";
import {
  IconAlertCircleFilled,
  IconExternalLink,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";

export interface IFrameModalProps {
  opened: boolean;
  handlers: any;
}

const IFrameModal = ({ opened, handlers }: IFrameModalProps) => {
  const { close } = handlers;
  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={true}
      centered
      padding="lg"
      radius="lg"
      closeOnClickOutside={false}
      closeOnEscape={false}
      trapFocus={false}
      title={
        <Group gap="xs">
          <IconAlertCircleFilled size={30} color={white} />
          <Text ta="center" c={white} fw={700} size="xl">
            UH OH!
          </Text>
        </Group>
      }
      overlayProps={{
        backgroundOpacity: 0.8,
      }}
    >
      <Stack align="center" justify="center" gap="lg">
          <Text size="lg" span>
            {
              "It appears you are playing on a third party website which may cause you to experience issues."
            }
            <br />
            <br />
            {"All users should play on "}
            <Text c={white} fw={700} span>
              relatle.io
            </Text>
            {
              " for the newest features, statistics tracking, and overall best experience."
            }
          </Text>
        <RelatleButton
          color={green}
          onClick={() => {
            window.open("https://relatle.io", "_blank");
          }}
          icon={<IconExternalLink />}
          text="Play on relatle.io"
        />
      </Stack>
    </Modal>
  );
};

export default IFrameModal;
