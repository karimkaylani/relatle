'use client'
import { Card, Divider, Flex, Group, Paper, Text } from '@mantine/core'
import React from 'react'

export interface GuessesResetsProps {
    guesses: number,
    resets: number
    greenBorder: boolean
}

const GuessesResets = (props: GuessesResetsProps) => {
    const {guesses, resets, greenBorder} = props

    const ScoreDisplay = (text: string, value: number) => {
        return (
            <Flex
            gap="3px"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            className="w-20 mb-1"
            >
                <Text size="sm" fw={500}>{text}</Text>
                <Text c="gray.1" size="36px" fw={700}>{value}</Text>
            </Flex>
        )
    }
  return (
    <Card shadow="md" radius="lg" p="xs" withBorder
    styles={{
        root: {
          border: greenBorder ? '4px solid #51cf66' : 'none',
        },
      }}
    >
        <Group justify="center">
            {ScoreDisplay("Guesses", guesses)}
            <Divider orientation="vertical" />
            {ScoreDisplay("Resets", resets)}
        </Group>
    </Card>
  )
}

export default GuessesResets