import { Box, Divider, Group, Paper, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { gray7, green, red, white } from "../colors";

export interface ScoreHistogramProps {
  bins: { [key: string]: number };
  guesses: number;
  won: boolean;
}

const ScoreHistogram = (props: ScoreHistogramProps) => {
  let { bins, won, guesses } = props;
  const [width, setWidth] = useState(0);
  let maxWidth = 350;
  const widthPadding = 80;
  const maxPctg = Math.max(...Object.values(bins));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = () =>
    setWidth(
      window.innerWidth > maxWidth + widthPadding
        ? maxWidth
        : window.innerWidth - widthPadding
    );

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const scoreInBin = (guesses: number, bin: string) => {
    if (bin.endsWith("+")) return guesses >= parseInt(bin.split("+")[0]);
    const [min, max] = bin.split("-").map((x) => parseInt(x));
    return guesses >= min && guesses <= max;
  };

  const Bar = (props: { color: string; value: number }) => {
    const { color, value } = props;
    return (
      <Group gap="3px" wrap="nowrap">
        <Paper
          w={(width - widthPadding) * (value / maxPctg)}
          h={24}
          bg={color}
          style={{ borderRadius: "0px 15px 15px 0px" }}
        />
        <Text c={white} fw={700} size="sm">
          {value.toFixed(0) + "%"}
        </Text>
      </Group>
    );
  };

  return (
    <Group gap="0px" w={width} wrap="nowrap" justify="center">
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
          <Bar
            key={i}
            color={won && scoreInBin(guesses, b) ? green: gray7}
            value={bins[b]}
          />
        ))}
      </Stack>
    </Group>
  );
};

export default ScoreHistogram;
