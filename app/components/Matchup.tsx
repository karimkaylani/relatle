import { Avatar, Button, Group, Text } from '@mantine/core'
import React from 'react'

export interface MatchupProps {
    start: string,
    start_img: string,
    end: string,
    end_img: string
}

const Matchup = (props: MatchupProps) => {
    const {start, start_img, end, end_img} = props

  return (
    <Group justify="center">
        <Group justify="center" gap="xs">
            <Avatar src={start_img} alt={start}/>
            <Text c="gray.1" size="25px" fw={500}>{start}</Text>
        </Group>
        <Text fw={500} c="gray.1" size="24px">→</Text>
        <Group justify="center" gap="xs">
            <Avatar src={end_img} alt={end}
            styles={{
                image: { border: '1.5px solid #51cf66', borderRadius: "100%"  }
              }}/>
            <Text c="green.5" size="25px" fw={700}>{end}</Text>
        </Group>
    </Group>
  )
}

export default Matchup