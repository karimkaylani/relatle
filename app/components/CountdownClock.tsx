import { Card, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import FlipNumbers from "react-flip-numbers";
import { gray8, gray9, red, white } from "../colors";

const CountdownClock = () => {
  const calculateTimeLeft = (): { hrs: string; mins: string; secs: string } => {
    const now = new Date();
    const tmrw = new Date(now);
    tmrw.setDate(now.getDate() + 1);
    tmrw.setHours(0, 0, 0, 0);

    const addLeadingZero = (number: number): string => {
      return number < 10 ? `0${number}` : `${number}`;
    };

    const timeDiff = tmrw.getTime() - now.getTime();
    const hrs = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const mins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return {
      hrs: addLeadingZero(hrs),
      mins: addLeadingZero(mins),
      secs: addLeadingZero(secs),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);
  return (
      <Stack
        gap="3px"
        justify="center"
        align="center"
        className="mb-1"
        styles={{ root: { minWidth: "80px" } }}
      >
        <Text size="sm" ta="center" fw={700} c={white}>
          Time Until Next Matchup
        </Text>
        <FlipNumbers
          height={38}
          width={24}
          color={white}
          play
          perspective={150}
          numbers={`${timeLeft.hrs}:${timeLeft.mins}:${timeLeft.secs}`}
          numberStyle={{
            fontFamily: "OpenSauceOne",
            fontSize: '22px',
            fontWeight: 700,
          }}
          nonNumberStyle={{
            fontFamily: "OpenSauceOne",
            fontWeight: 700,
            fontSize: '28px',
            color: white,
            marginBottom: '5px',
          }}
        />
      </Stack>
  );
};

export default CountdownClock;
