import { Card, Divider, Stack, Group, Space, Text } from "@mantine/core";
import React, { ReactNode } from "react";
import ScoreDisplay from "./ScoreDisplay";
import { yellow } from "../colors";

export interface ScoreboardProps {
  guesses: number;
  resets: number;
  borderColor?: string;
  small?: boolean;
}

const Scoreboard = (props: ScoreboardProps) => {
  const { guesses, resets, borderColor = null, small } = props;
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
        <ScoreDisplay text={"Guesses"} value={guesses.toString()} small={false}/>
        <Divider orientation="vertical" />
        <ScoreDisplay text={"Resets"} value={resets.toString()} small={false} changeColor={yellow}/>
      </Group>
    </Card>
  );
};

export default Scoreboard;
