import { Card, Divider, Stack, Group, Space, Text } from "@mantine/core";
import React, { ReactNode } from "react";
import ScoreDisplay from "./ScoreDisplay";
import { yellow } from "../colors";
import StreakDisplay from "./StreakDisplay";

export interface ScoreboardProps {
  guesses: number;
  resets: number;
  borderColor?: string | undefined;
  small?: boolean;
  streak?: number | undefined;
}

const Scoreboard = (props: ScoreboardProps) => {
  const {
    guesses,
    resets,
    borderColor = null,
    small,
    streak = undefined,
  } = props;
  return (
    <Card
      shadow="md"
      radius="lg"
      p="xs"
      withBorder
      styles={{
        root: {
          border: borderColor ? `4px solid ${borderColor}` : "none",
        },
      }}
    >
      <Group justify="center">
        {streak !== undefined && (
          <>
            <StreakDisplay streak={streak} />
            <Divider orientation="vertical" />
          </>
        )}
        <ScoreDisplay
          text={"Guesses"}
          value={guesses.toString()}
          small={false}
        />
        <Divider orientation="vertical" />
        <ScoreDisplay
          text={"Resets"}
          value={resets.toString()}
          small={false}
          changeColor={yellow}
        />
      </Group>
    </Card>
  );
};

export default Scoreboard;
