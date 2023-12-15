import React from 'react'
import { Artist, phoneMaxWidth } from './Game'
import { Avatar, Group, Stack, Text } from '@mantine/core'
import ArtistInfo from './ArtistInfo'

export interface RelatedArtistsTitleProps {
    artist: Artist,
    won: boolean,
    endArtist: Artist
}

const RelatedArtistsTitle = (props: RelatedArtistsTitleProps) => {
    const {artist, won, endArtist} = props
    let small = window.innerWidth <= phoneMaxWidth

    if (won) {
      return (
        <Stack align="center" gap="xs">
          <Group justify="center" gap="xs">
            <Text size={small ? "md" : "lg"}>You found</Text>
            <ArtistInfo artist={endArtist} small={small}/>
          </Group>
          {won && <Text size={small ? "sm" : "md"}>Tap the scoreboard to view your results</Text>}
        </Stack>
      )
    }

  return (
    <Group justify="center" gap="6px">
        <ArtistInfo artist={artist} small={small}/>
        <Text size={small ? "md" : "lg"}>related artists</Text>
    </Group>
  )
}

export default RelatedArtistsTitle