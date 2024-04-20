import {
  Burger,
  Card,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import React, { useEffect } from "react";
import { ScoreDisplay } from "./Scoreboard";
import CustomGameButton from "./CustomGameButton";
import IconHoverButton from "./IconHoverButton";
import { IconHelpCircle, IconRss } from "@tabler/icons-react";
import CoffeeButton from "./CoffeeButton";
import TransferStats from "./TransferStats";
import { useSearchParams } from "next/navigation";

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
      <Burger
        w={38}
        opened={opened}
        onClick={open}
        aria-label="Toggle Sidebar"
      />
      <Drawer size="xs" opened={opened} onClose={close}>
        <Stack justify="center" gap="lg">
          <Stack gap="xs">
            <Text size="xl" c="gray.1" fw={700}>
              Statistics
            </Text>
            <Card shadow="lg" radius="lg" p="xs">
              <Group align="center" justify="center">
                <Stack gap="sm">
                  {ScoreDisplay("Streak", streak.toString(), true)}
                  {ScoreDisplay("Games Won", games_won.toString(), true)}
                  {ScoreDisplay(
                    "Average Guesses",
                    average_score.toFixed(1),
                    true
                  )}
                  {ScoreDisplay(
                    "Best Guess Count",
                    lowest_score.toString(),
                    true
                  )}
                </Stack>

                <Divider orientation="vertical" />
                <Stack gap="sm">
                  {ScoreDisplay(
                    "Longest Streak",
                    longest_streak.toString(),
                    true
                  )}
                  {ScoreDisplay("Games Lost", games_lost.toString(), true)}
                  {ScoreDisplay(
                    "Average Resets",
                    average_resets.toFixed(1),
                    true
                  )}
                  {ScoreDisplay(
                    "Worst Guess Count",
                    highest_score.toString(),
                    true
                  )}
                </Stack>
              </Group>
            </Card>
          </Stack>
          <TransferStats />
          <CustomGameButton customModalOpen={customModalOpen} />
          <IconHoverButton
            onTap={htpOpen}
            icon={<IconHelpCircle size={18} />}
            text="HOW TO PLAY"
          />
          <CoffeeButton />
          <IconHoverButton
            url="https://docs.google.com/forms/d/e/1FAIpQLSeMEW3eGqVXheqidY43q9yMVK2QCi-AEJV3JGTuPK4LX9U9eA/viewform?usp=sf_link"
            onTap={() => {
              return;
            }}
            icon={<IconRss size={16} />}
            text="SEND FEEDBACK"
          />
        </Stack>
      </Drawer>
    </>
  );
};

export default SideDrawer;
