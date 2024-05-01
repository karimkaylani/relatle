import { Divider, Group, Stack, Text } from "@mantine/core";
import React from "react";
import { white } from "../colors";
import { Stats } from "./GameOver";
import ScoreHistogram from "./ScoreHistogram";

export interface GlobalScoreStatsProps {
  guesses: number;
  stats: Stats|null;
  won: boolean;
  shortestPath: number;
}

const Stat = (props: { label: string; value: string }) => {
  return (
    <Group justify="space-between">
      <Text ta="center">
        {props.label}
      </Text>
      <Text ta="center" c={white} fw={700}>
        {props.value}
      </Text>
    </Group>
  );
}

const GlobalScoreStats = (props: GlobalScoreStatsProps) => {
  const { guesses, stats, won, shortestPath } = props;
  return (
    <Stack align="center" justify="center">
      <Text fw={700} ta="center" size="sm" c={white}>
        {"Global Results"}
      </Text>
      {!stats ? (
        <Text ta="center" size="sm" c={white}>
          Come back soon for global results
        </Text>
      ) : (
        <>
          <Group justify='center' align="center" gap='35px'>
            <Stack>
                <Stat label={"Shortest Path"} value={shortestPath.toString()} />
                <Stat label={"Your Score"} value={guesses.toString()} />
                <Stat label={"Average Score"} value={stats.averageScore.toFixed(0)} />
            </Stack>
            <Stack>
                <Stat label={"Number of Plays"} value={stats.numGames.toLocaleString()} />
                <Stat label={"Perfect Game Rate"} value={stats.perfectGameRate.toFixed(0) + "%"} />
                <Stat label={"Win Rate"} value={stats.winRate.toFixed(0) + "%"} />
            </Stack>
          </Group>
          <Text fw={700} ta="center" size="sm" c={white}>
            {"Score Distribution"}
          </Text>
          <ScoreHistogram bins={stats.bins} guesses={guesses} won={won}/>
          <Text ta="center" size="sm">
            These values will update every couple of minutes
          </Text>
        </>
      )}
    </Stack>
  );
};

export default GlobalScoreStats;
