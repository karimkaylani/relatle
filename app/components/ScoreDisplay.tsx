"use client";
import { Space, Group, Text, Stack } from "@mantine/core";
import React, { ReactNode } from "react";
import FlipNumbers from "react-flip-numbers";
import dynamic from "next/dynamic";
import { AnimatedCounter } from "react-animated-counter";
import { white } from "../colors";

export interface ScoreDisplayProps {
  text: string;
  value: string;
  small?: boolean;
  icon?: ReactNode;
  textColor?: string;
  color?: string;
  decimal?: boolean;
  changeColor?: string;
}

const ScoreDisplay = (props: ScoreDisplayProps) => {
  const {
    text,
    value,
    small = true,
    icon,
    decimal = false,
    color = white,
    changeColor = white,
  } = props;
  const numberSize = small ? "24px" : "26px";
  return (
    <Stack
      gap="6px"
      justify="center"
      align="center"
      styles={{ root: { minWidth: "80px" } }}
    >
      <Text ta="center" size="sm" fw={500}>
        {text}
      </Text>
      <Group gap="0px">
        {icon && icon}

        <AnimatedCounter
          value={parseFloat(value)}
          includeDecimals={decimal}
          decimalPrecision={1}
          color={color}
          fontSize={numberSize}
          incrementColor={changeColor}
        />
      </Group>
    </Stack>
  );
};

export default ScoreDisplay;
