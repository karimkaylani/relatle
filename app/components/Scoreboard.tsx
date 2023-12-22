import { Card, Divider, Stack, Group, Space, Text } from '@mantine/core'
import React from 'react'
import FlipNumbers from 'react-flip-numbers'

export interface ScoreboardProps {
    guesses: number,
    resets: number
    greenBorder: boolean,
    small?: boolean
}

export const ScoreDisplay = (text: string, value: string, small:boolean|undefined) => {
  const numberSize = small ? 20 : 22
  return (
      <Stack
        gap="3px" justify="center"
        align="center" className="w-20 mb-1">
          <Text ta='center' size="sm" fw={500}>{text}</Text>
          <Space h={2}/>
          <FlipNumbers height={numberSize} width={numberSize-4} color="white" background="gray.9" 
              play perspective={150} numbers={value}
              numberStyle={{
                fontFamily: "OpenSauceOne",
                fontWeight: 700,
              }} />
      </Stack>
  )
}

const Scoreboard = (props: ScoreboardProps) => {
    const {guesses, resets, greenBorder, small} = props
  return (
    <Card shadow="md" radius="lg" p="xs" withBorder
    styles={{
        root: {
          border: greenBorder ? '4px solid #51cf66' : 'none',
        },
      }}
    >
        <Group justify="center">
            {ScoreDisplay("Guesses", guesses.toString(), small)}
            <Divider orientation="vertical" />
            {ScoreDisplay("Resets", resets.toString(), small)}
        </Group>
    </Card>
  )
}

export default Scoreboard