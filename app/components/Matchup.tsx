import { Avatar, Button, Group, Text } from '@mantine/core'
import React from 'react'

export interface MatchupProps {
    start: string,
    end: string,
    end_img: string
}

const Matchup = (props: MatchupProps) => {
    const {start, end, end_img} = props

  return (
    <Group justify="center">
        <Text size="25px">{start}</Text>
        <Text fw={700}>→</Text>
        <Group justify="center" gap="xs">
            <Avatar src={end_img} alt={end}/>
            <Text size="25px" fw={700}>{end}</Text>
        </Group>
    </Group>
  )
}

export default Matchup