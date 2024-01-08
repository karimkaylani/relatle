import { Group, Text } from '@mantine/core'
import React from 'react'
import ArtistInfo from './ArtistInfo'
import { Artist, phoneMaxWidth } from './Game'
import Arrow from './Arrow'
import PlayButton from './PlayButton'

export interface MatchupProps {
    start: Artist,
    end: Artist,
    small: boolean
    showPreviews?: boolean
}

const Matchup = React.forwardRef<HTMLDivElement, MatchupProps>((props, ref) => {
    const {start, end, small, showPreviews=false} = props

  return (
    <Group ref={ref} justify="center" gap="xs">
        <Group justify="center" gap="4px">
          <ArtistInfo artist={start} small={small}/>
          {showPreviews && <PlayButton audioUrl={start.top_song_preview_url}/>}
        </Group>
        <Arrow small={small}/>
        <Group justify="center" gap="4px">
          <ArtistInfo artist={end} small={small} is_green={true}></ArtistInfo>
          {showPreviews && <PlayButton audioUrl={end.top_song_preview_url}/>}
        </Group>
    </Group>
  )
})
Matchup.displayName = "Matchup"

export default Matchup