import {
  Burger,
  Card,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
  Image,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect } from "react";
import { ScoreDisplay } from "./Scoreboard";
import CustomGameButton from "./CustomGameButton";
import HoverButton from "./HoverButton";
import IconHoverButton from "./IconHoverButton";
import { IconHelpCircle } from "@tabler/icons-react";
import CoffeeButton from "./CoffeeButton";
import TransferStats from "./TransferStats";
import { useSearchParams } from "next/navigation";

export interface SideDrawerProps {
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
  const [opened, { open, close }] = useDisclosure(false);
  const {
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

  useEffect(() => {
    if (searchParams.get('transfer')) {
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
        <Stack justify="center" gap='lg'>
            <Image
                w={150}
                src="images/logo.png"
                alt="Relatle Logo"
            ></Image>
            <Stack gap='xs'>
                <Text size="xl" c="gray.1" fw={700}>
                    Statistics
                </Text>
                <Card shadow="lg" radius="lg" p="xs">
                    <Group align="center" justify="center">
                    {ScoreDisplay("Streak", streak.toString(), true)}
                    <Divider orientation="vertical" />
                    {ScoreDisplay("Longest Streak", longest_streak.toString(), true)}
                    {ScoreDisplay("Games Won", games_won.toString(), true)}
                    <Divider orientation="vertical" />
                    {ScoreDisplay("Games Lost", games_lost.toString(), true)}
                    {ScoreDisplay("Average Score", average_score.toFixed(1), true)}
                    <Divider orientation="vertical" />
                    {ScoreDisplay("Average Resets", average_resets.toFixed(1), true)}
                    {ScoreDisplay("Lowest Score", lowest_score.toString(), true)}
                    <Divider orientation="vertical" />
                    {ScoreDisplay("Highest Score", highest_score.toString(), true)}
                    {ScoreDisplay("Total Guesses", total_guesses.toString(), true)}
                    <Divider orientation="vertical" />
                    {ScoreDisplay("Total Resets", total_resets.toString(), true)}
                    </Group>
                </Card>
            </Stack>
            <TransferStats />
            <CustomGameButton
                customModalOpen={customModalOpen}
            />
            <IconHoverButton
                onTap={htpOpen}
                icon={<IconHelpCircle size={18} />}
                text="HOW TO PLAY"
            />
            <CoffeeButton />
        </Stack>
      </Drawer>
    </>
  );
};

export default SideDrawer;