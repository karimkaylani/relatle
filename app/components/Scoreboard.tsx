import { Card, Divider, Flex, Group, Text } from '@mantine/core'
import React from 'react'

export interface ScoreboardProps {
    guesses: number,
    resets: number
    greenBorder: boolean,
    small?: boolean
}

const ScoreDisplay = (text: string, value: string, small:boolean|undefined) => {
  const fontSize = small ? "25px": "35px"
  return (
      <Flex
        gap="3px" justify="center"
        align="center" direction="column"
        wrap="wrap" className="w-20 mb-1">
          <Text size="sm" fw={500}>{text}</Text>
          <Text c="gray.1" size={fontSize} fw={700}>{value}</Text>
      </Flex>
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