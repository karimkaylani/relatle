import { Card, Flex, Stack, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import FlipNumbers from 'react-flip-numbers';

const CountdownClock = () => {
    const calculateTimeLeft = (): { hrs: string; mins: string; secs: string } => {
    const now = new Date()
    const tmrw = new Date(now)
    tmrw.setDate(now.getDate() + 1)
    tmrw.setHours(0,0,0,0)

    const addLeadingZero = (number: number): string => {
        return number < 10 ? `0${number}` : `${number}`;
    }
    
    const timeDiff = tmrw.getTime() - now.getTime();
    const hrs = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return { hrs: addLeadingZero(hrs), mins: addLeadingZero(mins), secs: addLeadingZero(secs) };
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
    const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
    }, []);
  return (
    <Card shadow="md" radius="lg" p="xs">
        <Stack
        gap="3px" justify="center"
        align="center" className="mb-1"
        styles={{root: {minWidth: '80px'}}}>
        <Text size="sm" ta="center" fw={500}>Time until next matchup</Text>
        <FlipNumbers height={14} width={11} color="white" background="gray.9" 
        play perspective={150} numbers={`${timeLeft.hrs}:${timeLeft.mins}:${timeLeft.secs}`}
        numberStyle={{
            fontFamily: "OpenSauceOne",
            fontWeight: 700
        }} />
        </Stack>
    </Card>
  )
}

export default CountdownClock