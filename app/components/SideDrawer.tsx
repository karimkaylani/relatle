import {
  Burger,
  Card,
  Center,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import React, { useEffect } from "react";
import CustomGameButton from "./CustomGameButton";
import IconHoverButton from "./IconHoverButton";
import { IconBolt, IconBurger, IconFlag2, IconHelpCircle, IconMenu2 } from "@tabler/icons-react";
import CoffeeButton from "./CoffeeButton";
import TransferStats from "./TransferStats";
import { useSearchParams } from "next/navigation";
import ScoreDisplay from "./ScoreDisplay";
import StreakDisplay from "./StreakDisplay";
import { white } from "../colors";
import TopGamesButton from "./TopGamesButton";
import ArchiveButton from "./ArchiveButton";
import { feedBackForm, maxCustomTextWidth } from "./Game";

export interface SideDrawerProps {
  opened: boolean;
  handlers: any;
  streak: number;
  longest_streak: number;
  games_won: number;
  total_guesses: number;
  average_score: number;
  average_resets: number;
  total_resets: number;
  games_lost: number;
  lowest_score: number;
  highest_score: number;
  customModalOpen: () => void;
  htpOpen: () => void;
}

const SideDrawer = (props: SideDrawerProps) => {
  const searchParams = useSearchParams();
  const {
    opened,
    streak,
    longest_streak,
    games_won,
    total_guesses,
    average_score,
    average_resets,
    total_resets,
    games_lost,
    lowest_score,
    highest_score,
    customModalOpen,
    htpOpen,
  } = props;
  const { open, close } = props.handlers;

  useEffect(() => {
    // open the drawer after transfer initiated
    if (searchParams.get("transfer")) {
      open();
    }
  }, [searchParams, open]);

  return (
    <>
      <IconHoverButton onTap={open} text={'Menu'} icon={<IconMenu2 color={white} size={24}/>} showText={window.innerWidth > maxCustomTextWidth}/>
      <Drawer
        size="xs"
        opened={opened}
        onClose={close}
        title="Statistics"
        styles={{
          title: {
            fontSize: "20px",
            color: white,
            fontWeight: 700,
            lineHeight: "32px",
          },
          header: {
            paddingBottom: "8px",
          },
        }}
      >
        <Stack justify="center" gap="lg">
          <Stack gap="xs">
            <Card shadow="lg" radius="lg" p="sm" withBorder>
              <Group align="center" justify="center">
                <Stack gap="md">
                  <StreakDisplay streak={streak} />
                  <ScoreDisplay
                    text={"Games Won"}
                    value={games_won.toString()}
                  />
                  <ScoreDisplay
                    text={"Average Guesses"}
                    value={average_score.toFixed()}
                    decimal
                  />
                  <ScoreDisplay
                    text={"Best Guess Count"}
                    value={lowest_score.toString()}
                  />
                </Stack>
                <Divider orientation="vertical" />
                <Stack gap="md">
                  <ScoreDisplay
                    text={"Longest Streak"}
                    value={longest_streak.toString()}
                  />
                  <ScoreDisplay
                    text={"Games Lost"}
                    value={games_lost.toString()}
                  />
                  <ScoreDisplay
                    text={"Average Resets"}
                    value={average_resets.toFixed(1)}
                    decimal
                  />
                  <ScoreDisplay
                    text={"Worst Guess Count"}
                    value={highest_score.toString()}
                  />
                </Stack>
              </Group>
            </Card>
          </Stack>
          <TransferStats />
          <CustomGameButton customModalOpen={customModalOpen} text='Create Custom Game'/>
          <TopGamesButton text='Top Custom Games' />
          <ArchiveButton text='Past Daily Games' />
          <Divider w={44} style={{ margin: "auto" }} />
          <IconHoverButton
            onTap={htpOpen}
            icon={<IconHelpCircle size={24} color="white" />}
            text="How to Play"
          />
          <CoffeeButton />
          <IconHoverButton
            onTap={() => {
              window.open(
                feedBackForm,
                "_blank"
              );
            }}
        icon={<IconFlag2 size={22} color="white" />}
            text="Send Feedback"
          />
        </Stack>
      </Drawer>
    </>
  );
};

export default SideDrawer;
