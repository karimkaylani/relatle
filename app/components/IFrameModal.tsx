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
}

const IFrameModal = ({ opened }: IFrameModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      withCloseButton={false}
      centered
      padding="lg"
      radius="lg"
      closeOnClickOutside={false}
    >
      <Stack align="center" justify="center" gap="lg">
        <Stack gap="md">
          <Group gap="xs">
            <IconAlertCircleFilled size={30} color={white} />
            <Text ta="center" c={white} fw={700} size="xl">
              UH OH!
            </Text>
          </Group>

          <Text size="lg" span>
            {
              "It appears you are playing on a third party website which may cause you to experience issues."
            }
            <br />
            <br />
            {"All users should play on "}
            <Text c={white} fw={700} span>relatle.io</Text>
            {
              " for the newest features, statistics tracking, and overall best experience."
            }
          </Text>
        </Stack>
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
