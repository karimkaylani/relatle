import { Card, Group, Stack, Text } from "@mantine/core";
import React from "react";
import { Artist, phoneMaxWidth } from "./Game";
import Matchup from "./Matchup";
import HoverButton from "./HoverButton";
import { generateCustomGameURL } from "./ShareCustomGame";
import Link from "next/link";
import { CardContainerStyles } from "./TopCustomGames";

export interface DailyGameCardProps {
  start: Artist;
  end: Artist;
  date: string;
  matchupID: number;
  web: { [key: string]: Artist };
}

const DailyGameGameCard = (props: DailyGameCardProps) => {
  const { start, end, web, date, matchupID } = props;
  const url = generateCustomGameURL(start.name, end.name);
  const maxWidth = 500;
  return (
    <Link
      href={url}
      target={
        window.matchMedia("(display-mode: standalone)").matches
          ? "_self"
          : "_blank"
      }
      prefetch={false}
      tabIndex={-1}
    >
      <HoverButton onTap={() => {}}>
        <Card
          shadow="lg"
          radius="lg"
          p="sm"
          withBorder
          w={window.innerWidth > maxWidth ? maxWidth : window.innerWidth - 40}
        >
          <Stack>
            <Text size="sm" fw={700} ta="left">
              {"#" + matchupID + " | " + date}
            </Text>
            <Matchup
              start={start}
              end={end}
              small={window.innerWidth < phoneMaxWidth}
              center={false}
              web={web}
            />
          </Stack>
        </Card>
      </HoverButton>
    </Link>
  );
};

export default DailyGameGameCard;
