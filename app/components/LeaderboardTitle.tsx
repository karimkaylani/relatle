import { Group, Stack, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { white } from "../colors";
import CustomGameButton from "./CustomGameButton";
import { maxCustomTextWidth, phoneMaxWidth } from "./Game";
import HoverButton from "./HoverButton";
import Logo from "./Logo";

export interface LeaderboardTitleProps {
  title: string;
  openCustomModal: () => void;
}

const LeaderboardTitle = ({title, openCustomModal}: LeaderboardTitleProps) => {
  const createButtonWidth =
    window.innerWidth > phoneMaxWidth
      ? 95.53
      : window.innerWidth > maxCustomTextWidth
      ? 88.74
      : 42;
  const arrowSize = window.innerWidth > phoneMaxWidth ? 40 : 34;
  return (
    <Group
      justify="space-between"
      align="center"
      w="100%"
      wrap="nowrap"
      style={{ maxWidth: "816px" }}
    >
      <Link href={"/"} style={{ textAlign: "left" }}>
        <Group justify="flex-start" w={createButtonWidth}>
          <HoverButton onTap={() => {}}>
            <IconArrowLeft size={arrowSize} color={white} />
          </HoverButton>
        </Group>
      </Link>
      <Stack justify="center" align="center" gap="0px">
        <Link href={"/"}>
          <Logo />
        </Link>
        <Text p="0px" c={white} ta="center">
          {title}
        </Text>
      </Stack>
      <CustomGameButton
        customModalOpen={openCustomModal}
        text="Create"
        showText={window.innerWidth > maxCustomTextWidth}
      />
    </Group>
  );
};

export default LeaderboardTitle;
