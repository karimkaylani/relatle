import { Card, Divider, Flex, Group, Text } from '@mantine/core'
import React from 'react'

export interface ScoreboardProps {
    guesses: number,
    resets: number
    greenBorder: boolean
}

const ScoreDisplay = (text: string, value: string) => {
  return (
      <Flex
        gap="3px" justify="center"
        align="center" direction="column"
        wrap="wrap" className="w-20 mb-1">
          <Text size="sm" fw={500}>{text}</Text>
          <Text c="gray.1" size="35px" fw={700}>{value}</Text>
      </Flex>
  )
}

const Scoreboard = (props: ScoreboardProps) => {
    const {guesses, resets, greenBorder} = props
  return (
    <Card shadow="md" radius="lg" p="xs" withBorder
    styles={{
        root: {
          border: greenBorder ? '4px solid #51cf66' : 'none',
        },
      }}
    >
        <Group justify="center">
            {ScoreDisplay("Guesses", guesses.toString())}
            <Divider orientation="vertical" />
            {ScoreDisplay("Resets", resets.toString())}
        </Group>
    </Card>
  )
}

export default Scoreboard