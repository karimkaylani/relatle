import { Card, Group, Stack } from '@mantine/core'
import React from 'react'
import { Artist, phoneMaxWidth } from './Game'
import Matchup from './Matchup'
import { Stat } from './GlobalScoreStats'
import HoverButton from './HoverButton'
import { generateCustomGameURL } from './ShareCustomGame'

export interface GameCardProps {
    start: Artist,
    end: Artist,
    plays: number,
    avg_score: number,
    win_rate: number,
}

const GameCard = (props: GameCardProps) => {
    const { start, end, plays, avg_score, win_rate } = props
    const url = generateCustomGameURL(start.name, end.name)
    const maxWidth = 330;
  return (
    <HoverButton onTap={() => window.open(url, '_blank')}>
    <Card shadow="lg" radius="lg" p="sm" withBorder w={window.innerWidth > maxWidth ? maxWidth : undefined}> 
        <Stack gap='xs'>
        <Matchup start={start} end={end} small={true} />
        <Group>
            <Stat label={'Plays'} value={plays.toLocaleString()} />
            <Stat label={'Avg Score'} value={avg_score.toFixed(0)} />
            <Stat label={'Win Rate'} value={win_rate.toFixed(0) + '%'} />
        </Group>
        </Stack>
    </Card>
    </HoverButton>
  )
}

export default GameCard