import { Group, Text } from '@mantine/core'
import React from 'react'
import ArtistInfo from './ArtistInfo'
import { Artist } from './Game'
import Arrow from './Arrow'

export interface MatchupProps {
    start: Artist,
    end: Artist
}

const Matchup = (props: MatchupProps) => {
    const {start, end} = props

  return (
    <Group justify="center">
        <ArtistInfo artist={start} small={false}></ArtistInfo>
        <Arrow small={false}/>
        <ArtistInfo artist={end} small={false} is_green={true}></ArtistInfo>
    </Group>
  )
}

export default Matchup