import {
  Group,
  Paper,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import React, { Fragment, useEffect, useState } from "react";

interface CircleProps {
  color: string;
  value: number;
}

export interface GlobalScoreSliderProps {
  avgGuesses: number;
  minGuesses: number;
  guesses: number;
  won: boolean;
}

const GlobalScoreSlider = (props: GlobalScoreSliderProps) => {
  let { avgGuesses, minGuesses, guesses, won } = props;
  const range = [
    Math.min(avgGuesses, minGuesses, guesses),
    Math.max(avgGuesses, minGuesses, guesses),
  ];

  const [width, setWidth] = useState(0);
  const maxWidth = 410;
  const widthPadding = 80;
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
  }, []);

  const Circle = (props: CircleProps) => {
    const { color, value } = props;
    const rangeSize = range[1] - range[0];
    const circleSize = 20;
    const padding = ((value - range[0]) / rangeSize) * width;
    return (
      <Paper
        bg={color}
        radius="xl"
        w={circleSize + 12}
        styles={{
          root: {
            marginBottom: -32,
            marginLeft: -15,
            left: padding,
            position: "relative",
            border: "6px solid #495057",
            borderRadius: "70%",
          },
        }}
      >
        <Space h={circleSize}></Space>
      </Paper>
    );
  };
  if (guesses < minGuesses && won) {
    minGuesses = guesses;
  }

  let yourScoreColor = won ? "green.6" : "red.6";
  let yourScoreColorHex = won ? "#40c057" : "#fa5252";

  let scores: [string, number, string][] = [
    ["Min. Guesses", minGuesses, "gray.1"],
    ["Avg. Guesses", avgGuesses, "yellow.5"],
    ["Your Score", guesses, yourScoreColor],
  ];

  scores.sort((a, b) => a[1] - b[1]);

  if (guesses === minGuesses) {
    yourScoreColor = `linear-gradient(to right, #f1f3f5 10px, ${yourScoreColorHex} 10px`;
  } else if (guesses === avgGuesses) {
    yourScoreColor = `linear-gradient(to right, ${yourScoreColorHex} 10px, #fcc419 10px`;
  }
  return (
    <Fragment>
      <div style={{ margin: 0, padding: 0 }}>
        <Paper bg="gray.7" w={width} radius="xl" className="-mb-5">
          <Space h={10} />
        </Paper>
        <Circle color="gray.1" value={minGuesses} />
        <Circle color="yellow.5" value={avgGuesses} />
        <Circle color={yourScoreColor} value={guesses} />
      </div>
      <Stack>
        <Group justify="center" align="center" gap="xs">
          {scores.map(([label, score, color], index) => (
            <Fragment key={label}>
              <Text fw={700} size="sm" c={color}>
                {label}: {score}
              </Text>
              {index !== scores.length - 1 && (
                <Text fw={700} size="sm" c="gray.7">
                  |
                </Text>
              )}
            </Fragment>
          ))}
        </Group>
      </Stack>
    </Fragment>
  );
};

export default GlobalScoreSlider;
