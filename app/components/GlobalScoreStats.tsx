import { Divider, Group, Stack, Text } from "@mantine/core";
import React from "react";
import { white } from "../colors";
import ScoreHistogram from "./ScoreHistogram";
import { Stats } from "../db";

export interface GlobalScoreStatsProps {
  guesses: number;
  stats: Stats;
  won: boolean;
  shortestPath: number;
}

export const Stat = (props: { label: string; value: string }) => {
  return (
    <Group justify="space-between">
      <Text ta="center" size="sm">
        {props.label}
      </Text>
      <Text ta="center" c={white} fw={700} size="sm">
        {props.value}
      </Text>
    </Group>
  );
};

const GlobalScoreStats = (props: GlobalScoreStatsProps) => {
  const { guesses, stats, won, shortestPath } = props;
  return (
    <Stack align="center" justify="center">
       <Text fw={700} ta="center" size="sm" c={white}>
        {"Global Score Distribution"}
      </Text>
      <ScoreHistogram bins={stats.bins} guesses={guesses} won={won} />
      <Text fw={700} ta="center" size="sm" c={white}>
        {"Matchup Stats"}
      </Text>
      <Group justify="center" align="center" gap="35px">
        <Stack>
          <Stat label={"Shortest Path"} value={shortestPath.toString()} />
          <Stat label={"Average Score"} value={stats.averageScore.toFixed(0)} />
          <Stat label={"Your Score"} value={guesses.toString()} />
        </Stack>
        <Stack>
          <Stat
            label={"Number of Plays"}
            value={stats.numGames.toLocaleString()}
          />
          <Stat label={"Win Rate"} value={stats.winRate.toFixed(0) + "%"} />
          <Stat
            label={"Perfect Game Rate"}
            value={stats.perfectGameRate.toFixed(0) + "%"}
          />
        </Stack>
      </Group>
      <Text ta="center" size="sm">
        These values will update as the day progresses
      </Text>
    </Stack>
  );
};

export default GlobalScoreStats;
