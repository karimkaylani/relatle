import { Modal, Stack, Text, Image, Button } from "@mantine/core";
import React from "react";

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
    >
      <Stack align="center" justify="center" gap="lg">
        <Stack gap="xs">
          <Text ta="center" c="gray.1" fw={700} size="xl">
            Introducing previews
          </Text>
          <Text ta="center" size="md">
            You can now press and hold on an artist to hear a preview of their
            music. Try it out!
          </Text>
        </Stack>
        <Image w={163} src="images/preview.png" alt="Song Previews" />
        <Button color="gray.7" w={150} onClick={newFeatureModalClose}>
          GOT IT!
        </Button>
      </Stack>
    </Modal>
  );
};

export default NewFeatureModal;
