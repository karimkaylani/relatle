"use client";
import { Group, Stack, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { white } from "../colors";
import CustomGameButton from "./CustomGameButton";
import { maxCustomTextWidth, phoneMaxWidth } from "./Game";
import HoverButton from "./HoverButton";
import Logo from "./Logo";
import { useRouter } from "next/navigation";
import TopGamesButton from "./TopGamesButton";

export interface LeaderboardTitleProps {
  title: string;
  openCustomModal: () => void;
}

const LeaderboardTitle = ({
  title,
  openCustomModal,
}: LeaderboardTitleProps) => {
  const router = useRouter();
  const arrowSize = window.innerWidth > phoneMaxWidth ? 40 : 34;
  return (
    <Group
      justify="space-between"
      align="center"
      wrap="nowrap"
      gap="sm"
      styles={{ root: { width: "100%", maxWidth: "816px" } }}
    >
      <Group
        wrap="nowrap"
        style={{
          flexGrow: 1,
          flexBasis: 0,
          display: "flex",
          justifyContent: "flex-start",
        }}
        gap="8px"
      >
        <HoverButton
          onTap={() => {
            // If refferrer has same domain, then just go back
            if (document.referrer.indexOf(location.protocol + "//" + location.host) === 0) {
              router.back();
            } else {
              router.push("/");
            }
          }}
        >
          <IconArrowLeft size={arrowSize} color={white} />
        </HoverButton>
      </Group>
      <Link href={'/'}>
        <Stack gap="0px">
          <Logo />
            <Text p="0px" c={white} ta="center">
              {title}
            </Text>
        </Stack>
      </Link>
      <Group
        wrap="nowrap"
        style={{
          flexGrow: 1,
          flexBasis: 0,
          display: "flex",
          justifyContent: "flex-end",
        }}
        gap="8px"
      >
        <CustomGameButton
          customModalOpen={openCustomModal}
          text="Create"
          showText={window.innerWidth > maxCustomTextWidth}
        />
      </Group>
    </Group>
  );
};

export default LeaderboardTitle;
