import { Stack, Text } from "@mantine/core";
import React, { Fragment } from "react";
import GlobalScoreSlider from "./GlobalScoreSlider";
import { white } from "../colors";
import { phoneMaxWidth } from "./Game";

export interface GlobalScoreStatsProps {
  guesses: number;
  allGuesses: number[];
  won: boolean;
}

const GlobalScoreStats = (props: GlobalScoreStatsProps) => {
  const { guesses, allGuesses, won } = props;
  const avgGuesses = allGuesses.reduce((a, b) => a + b, 0) / allGuesses.length;
  const minGuesses = Math.min(...allGuesses);
  const roundedAvgGuesses = Math.round(avgGuesses);
  return (
    <Stack gap="xl" align="center" justify="center">
      <Text fw={700} ta="center" size={window.innerWidth > phoneMaxWidth ? 'md' : 'sm'}>
        {"Global Matchup Stats"}
      </Text>
      <GlobalScoreSlider
        guesses={guesses}
        avgGuesses={roundedAvgGuesses}
        minGuesses={minGuesses}
        won={won}
      />
    </Stack>
  );
};

export default GlobalScoreStats;
