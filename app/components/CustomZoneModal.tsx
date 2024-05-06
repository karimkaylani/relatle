import { Modal, Stack, Text, Image, Group } from "@mantine/core";
import React from "react";
import { Artist } from "./Game";
import { green, white } from "../colors";
import { useDisclosure } from "@mantine/hooks";
import CustomGameModal from "./CustomGameModal";
import IconHoverButton from "./IconHoverButton";
import RelatleButton from "./RelatleButton";
import CustomIcon from "./CustomIcon";
import { IconList } from "@tabler/icons-react";
import Link from "next/link";

export interface CustomZoneModalProps {
  customZoneOpened: boolean;
  customZoneHandlers: any;
  web: { [key: string]: Artist };
  matchups: string[][];
}

const CustomZoneModal = (props: CustomZoneModalProps) => {
  const { customZoneOpened, customZoneHandlers, web, matchups } = props;
  const { close: customZoneClose } = customZoneHandlers;

  const [customModalOpened, customModalHandlers] = useDisclosure(false);
  const { open: customModalOpen } = customModalHandlers;
  return (
    <>
      <Modal
        opened={customZoneOpened}
        onClose={customZoneClose}
        withCloseButton={true}
        centered
        padding="lg"
        radius="lg"
        closeOnClickOutside={true}
        title="The Custom Game Zone"
        styles={{
          title: {
            fontSize: "20px",
            color: white,
            fontWeight: 700,
            lineHeight: "32px",
            textAlign: "center",
            width: "100%",
          },
          header: {
            paddingBottom: "8px",
          },
        }}
      >
        <Stack align="center" justify="center">
          <Text ta="center">
            Make your own custom game to play and share or browse our most
            popular matchups.
          </Text>
          <Image w={274} src="images/custom-zone.png" alt="Custom Games" />
          <Group align="center" justify="center">
            <Link href="/leaderboard">
              <RelatleButton
                color={white}
                text="Browse"
                onClick={() => {}}
                icon={<IconList size={18} color={white} />}
              />
            </Link>
            <RelatleButton
              color={green}
              text="Create"
              onClick={() => {
                customZoneClose();
                customModalOpen();
              }}
              icon={<CustomIcon color={green} />}
            />
          </Group>
        </Stack>
      </Modal>

      <CustomGameModal
        customModalOpened={customModalOpened}
        customModalHandlers={customModalHandlers}
        web={web}
        matchups={matchups}
      />
    </>
  );
};

export default CustomZoneModal;
