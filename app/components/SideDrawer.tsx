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
import { IconBolt, IconFlag2, IconHelpCircle } from "@tabler/icons-react";
import CoffeeButton from "./CoffeeButton";
import TransferStats from "./TransferStats";
import { useSearchParams } from "next/navigation";
import ScoreDisplay from "./ScoreDisplay";

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
  const [test, setTest] = React.useState<number>(0);

  useEffect(() => {
    // open the drawer after transfer initiated
    if (searchParams.get("transfer")) {
      open();
    }
    setTest(7)
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
            <Card shadow="lg" radius="lg" p="xs" withBorder>
              <Group align="center" justify="center">
                <Stack gap="sm">
                  <ScoreDisplay
                    text={"Streak"}
                    value={streak.toString()}
                    icon={streak > 1 && <IconBolt color="#EDD600" />}
                    color={streak > 1 ? "#EDD600" : "white"}
                  />
                  <ScoreDisplay text={"Games Won"} value={games_won.toString()}/>
                  <ScoreDisplay text={"Average Guesses"} value={average_score.toFixed()} decimal/>
                  <ScoreDisplay text={"Best Guess Count"} value={lowest_score.toString()}/>
                </Stack>
                <Divider orientation="vertical" />
                <Stack gap="sm">
                  <ScoreDisplay text={"Longest Streak"} value={longest_streak.toString()}/>
                  <ScoreDisplay text={"Games Lost"} value={games_lost.toString()}/>
                  <ScoreDisplay text={"Average Resets"} value={average_resets.toFixed(1)} decimal/>
                  <ScoreDisplay text={"Worst Guess Count"} value={highest_score.toString()}/>
                </Stack>
              </Group>
            </Card>
          </Stack>
          <TransferStats />
          <CustomGameButton customModalOpen={customModalOpen} caps={false} />
          <Divider w={44} style={{ margin: "auto" }} />
          <IconHoverButton
            onTap={htpOpen}
            icon={<IconHelpCircle size={18} />}
            text="How to Play"
          />
          <CoffeeButton caps={false} />
          <IconHoverButton
            url="https://docs.google.com/forms/d/e/1FAIpQLSeMEW3eGqVXheqidY43q9yMVK2QCi-AEJV3JGTuPK4LX9U9eA/viewform?usp=sf_link"
            onTap={() => {
              return;
            }}
            icon={<IconFlag2 size={16} />}
            text="Send Feedback"
          />
        </Stack>
      </Drawer>
    </>
  );
};

export default SideDrawer;
