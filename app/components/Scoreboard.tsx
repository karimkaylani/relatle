import { Card, Divider, Stack, Group, Space, Text } from "@mantine/core";
import React from "react";
import FlipNumbers from "react-flip-numbers";

export interface ScoreboardProps {
  guesses: number;
  resets: number;
  borderColor?: string;
  small?: boolean;
}

export const ScoreDisplay = (
  text: string,
  value: string,
  small: boolean | undefined
) => {
  const numberSize = small ? 20 : 22;
  return (
    <Stack
      gap="3px"
      justify="center"
      align="center"
      className="mb-1"
      styles={{ root: { minWidth: "80px" } }}
    >
      <Text ta="center" size="sm" fw={500}>
        {text}
      </Text>
      <Space h={2} />
      <FlipNumbers
        height={numberSize}
        width={numberSize - 4}
        color="white"
        background="gray.9"
        play
        perspective={150}
        numbers={value}
        numberStyle={{
          fontFamily: "OpenSauceOne",
          fontWeight: 700,
        }}
      />
    </Stack>
  );
};

const Scoreboard = (props: ScoreboardProps) => {
  const { guesses, resets, borderColor=null, small } = props;
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
        {ScoreDisplay("Guesses", guesses.toString(), small)}
        <Divider orientation="vertical" />
        {ScoreDisplay("Resets", resets.toString(), small)}
      </Group>
    </Card>
  );
};

export default Scoreboard;
