import { Group, Text } from '@mantine/core'
import React from 'react'
import ArtistInfo from './ArtistInfo'
import { Artist } from './Game'

export interface MatchupProps {
    start: Artist,
    end: Artist
}

const Matchup = (props: MatchupProps) => {
    const {start, end} = props

  return (
    <Group justify="center">
        <ArtistInfo artist={start} small={false} is_green={false}></ArtistInfo>
        <Text fw={500} c="gray.1" size="25px">→</Text>
        <ArtistInfo artist={end} small={false} is_green={true}></ArtistInfo>
    </Group>
  )
}

export default Matchup