import { Card, Group, Stack, Text } from '@mantine/core'
import React from 'react'
import { Artist, phoneMaxWidth } from './Game'
import Matchup from './Matchup'
import { Stat } from './GlobalScoreStats'
import HoverButton from './HoverButton'
import { generateCustomGameURL } from './ShareCustomGame'
import Link from 'next/link'

export interface GameCardProps {
    start: Artist,
    end: Artist,
    plays: number,
    avg_score: number,
    win_rate: number,
    index: number
}

const GameCard = (props: GameCardProps) => {
    const { start, end, plays, avg_score, win_rate, index } = props
    const url = generateCustomGameURL(start.name, end.name)
    const maxWidth = 500;
  return (
    <Link href={url} target='_blank' prefetch={false} tabIndex={-1}>
    <HoverButton onTap={() => {}}>
    <Card shadow="lg" radius="lg" p="sm" withBorder w={window.innerWidth > maxWidth ? maxWidth : window.innerWidth - 40}> 
      <Group wrap='nowrap'>
        <Text>{index}</Text>
        <Stack gap='xs'>
        <Matchup start={start} end={end} small={window.innerWidth < phoneMaxWidth} center={false} />
        <Group>
            <Stat label={'Plays'} value={plays.toLocaleString()} />
            <Stat label={'Avg Score'} value={avg_score.toFixed(0)} />
            <Stat label={'Win Rate'} value={win_rate.toFixed(0) + '%'} />
        </Group>
        </Stack>
      </Group>
    </Card>
    </HoverButton>
    </Link>
  )
}

export default GameCard