import { Card, Divider, Flex, Group, Paper, Text } from '@mantine/core'
import React from 'react'

export interface GuessesResetsProps {
    guesses: number,
    resets: number
}

const GuessesResets = (props: GuessesResetsProps) => {
    const {guesses, resets} = props

  return (
    <Card shadow="md" radius="md" p="xs" withBorder>
        <Group justify="center">
            
            <Flex
            gap="xs"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            className="w-20"
            >
                <Text size="sm" fw={500}>Guesses</Text>
                <Text c="gray.1" size="36px" fw={700}>{guesses}</Text>
            </Flex>
            <Divider orientation="vertical" />
            <Flex
            gap="xs"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            className="w-20"
            >
                <Text size="sm" fw={500}>Resets</Text>
                <Text c="gray.1" size="36px" fw={700}>{resets}</Text>
            </Flex>
        </Group>
    </Card>
  )
}

export default GuessesResets