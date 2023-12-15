import { Group, Text } from '@mantine/core'
import React from 'react'
import ArtistInfo from './ArtistInfo'
import { Artist, phoneMaxWidth } from './Game'
import Arrow from './Arrow'

export interface MatchupProps {
    start: Artist,
    end: Artist,
    small: boolean
}

const Matchup = React.forwardRef<HTMLDivElement, MatchupProps>((props, ref) => {
    const {start, end, small} = props

  return (
    <Group ref={ref} justify="center" gap="xs">
        <ArtistInfo artist={start} small={small}></ArtistInfo>
        <Arrow small={true}/>
        <ArtistInfo artist={end} small={small} is_green={true}></ArtistInfo>
    </Group>
  )
})
Matchup.displayName = "Matchup"

export default Matchup