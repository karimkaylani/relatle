import { Box, Divider, Group, Paper, Stack, Text } from "@mantine/core";
import React from "react";
import { gray7, green, red, white } from "../colors";

export interface ScoreHistogramProps {
  bins: { [key: string]: number };
  guesses: number;
  won: boolean;
}

const ScoreHistogram = (props: ScoreHistogramProps) => {
  let { bins, won, guesses } = props;
  // 330.88 width max
  let maxWidth = window.innerWidth > 365 ? 280 : 200;
  const maxPctg = Math.max(...Object.values(bins));
  maxWidth = maxPctg > 0 ? maxWidth / (maxPctg / 100) : maxWidth;

  const scoreInBin = (guesses: number, bin: string) => {
    const [min, max] = bin.split("-").map((x) => parseInt(x));
    return guesses >= min && guesses <= max;
};

  const Bar = (props: {
    color: string;
    value: number;
  }) => {
    const { color, value } = props;
    return (
    <Group gap='3px' wrap="nowrap">
        <Paper w={maxWidth * (value / 100)} h={24} bg={color} style={{borderRadius: '0px 15px 15px 0px'}} />
        <Text c={white} fw={700} size="sm">
            {value.toFixed(0) + "%"}
        </Text>
     </Group>
    )
  };

  return (
    <Group gap="0px" w="100%" wrap="nowrap">
      <Stack className="mr-2" justify="space-around" h={184}>
        {Object.keys(bins).map((b, i) => (
            <Text c={white} fw={700} size="sm" key={i}>
                {b}
            </Text>
        ))}
      </Stack>
      <Divider c={white} orientation="vertical" />
      <Stack>
        {Object.keys(bins).map((b, i) => (
            <Bar key={i} color={scoreInBin(guesses, b) ? (won ? green : red) : gray7} value={bins[b]} />
        ))}
      </Stack>
    </Group>
  );
};

export default ScoreHistogram;
