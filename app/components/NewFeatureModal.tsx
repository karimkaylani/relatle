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
            More Matchup Stats!
          </Text>
          <Text ta="center" size="md" style={{maxWidth: 350}}>
          {"When finishing a daily or custom matchup, you'll now get loads of new global stats. There’s also a special surprise for getting the shortest path!"}
          </Text>
        </Stack>
        <Image w={274} src="images/new-stats.png" alt="Song Previews" />
        <Group>
          <RelatleButton color={green} onClick={() => {
            window.open("https://www.reddit.com/r/relatle/comments/1cixlur/update_new_matchup_stats_view_current_path/", "_blank");
          }} icon={<IconBrandReddit />} text="Discuss"/>
          <RelatleButton color={white} onClick={newFeatureModalClose} text="Got It!"/>
        </Group>
        
      </Stack>
    </Modal>
  );
};

export default NewFeatureModal;
