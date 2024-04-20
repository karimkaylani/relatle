"use client";
import { Space, Group, Text, Stack } from "@mantine/core";
import React, { ReactNode } from "react";
import FlipNumbers from "react-flip-numbers";
import dynamic from "next/dynamic";
import { AnimatedCounter } from "react-animated-counter";

export interface ScoreDisplayProps {
  text: string;
  value: string;
  small?: boolean;
  icon?: ReactNode;
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
    decimal=false,
    color = "white",
    changeColor='white'
  } = props;
  const numberSize = (small ? '24px' : '26px');
  return (
    <Stack
      gap="4px"
      justify="center"
      align="center"
      styles={{ root: { minWidth: "80px" } }}
    >
      <Text ta="center" size="sm" fw={500} c={color && color}>
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
        {/* <AnimatedNumbers
          animateToNumber={parseFloat(value)}
          fontStyle={{
            fontFamily: "OpenSauceOne",
            fontWeight: 700,
            fontSize: numberSize,
            color: color,
          }}
        /> */}

        {/* <FlipNumbers
            height={numberSize}
            width={numberSize - 4}
            color={color}
            background="gray.9"
            play={true}
            perspective={150}
            duration={5}
            numbers={value}
            numberStyle={{
              fontFamily: "OpenSauceOne",
              fontWeight: 700,
            }}
            nonNumberStyle={{
              fontFamily: "OpenSauceOne",
              fontSize: "1.5em",
            }} 
        />*/}
      </Group>
    </Stack>
  );
};

export default ScoreDisplay;
