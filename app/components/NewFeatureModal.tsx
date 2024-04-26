import { Modal, Stack, Text, Image, Button, Group } from "@mantine/core";
import React from "react";
import { green, white } from "../colors";
import RelatleButton from "./RelatleButton";
import { IconBrandReddit } from "@tabler/icons-react";

export interface NewFeatureModalProps {
  newFeatureModalOpened: boolean;
  newFeatureModalHandlers: any;
}

const NewFeatureModal = (props: NewFeatureModalProps) => {
  const { newFeatureModalOpened, newFeatureModalHandlers } = props;
  const { close: newFeatureModalClose } = newFeatureModalHandlers;
  return (
    <Modal
      opened={newFeatureModalOpened}
      onClose={newFeatureModalClose}
      withCloseButton={false}
      centered
      padding="lg"
      radius="lg"
      closeOnClickOutside={false}
    >
      <Stack align="center" justify="center" gap="lg">
        <Stack gap="md">
          <Text ta="center" c={white} fw={700} size="xl">
            Relatle has new artists!
          </Text>
          <Text ta="center" size="md">
          {"We’ve added more of your favs and now let you pick from up to 12 artists per guess (previously 10)."}
          </Text>
        </Stack>
        <Image w={274} src="images/new-artists.png" alt="Song Previews" />
        <Group>
          <RelatleButton color={green} onClick={() => {
            window.open("https://www.reddit.com/r/relatle/", "_blank");
          }} icon={<IconBrandReddit />} text="View New Artists"/>
          <RelatleButton color={white} onClick={newFeatureModalClose} text="Got It!"/>
        </Group>
        
      </Stack>
    </Modal>
  );
};

export default NewFeatureModal;
