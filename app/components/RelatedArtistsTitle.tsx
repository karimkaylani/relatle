import React from 'react'
import { Artist } from './Game'
import { Avatar, Group, Stack, Text } from '@mantine/core'
import ArtistInfo from './ArtistInfo'

export interface RelatedArtistsTitleProps {
    artist: Artist,
    won: boolean,
    endArtist: Artist
}

const RelatedArtistsTitle = (props: RelatedArtistsTitleProps) => {
    const {artist, won, endArtist} = props

    if (won) {
      return (
        <Stack align="center" gap="xs">
          <Group justify="center" gap="xs">
            <Text size="xl">You found</Text>
            <ArtistInfo artist={endArtist} small={false}/>
          </Group>
          {won && <Text>Tap the scoreboard to view your results</Text>}
        </Stack>
      )
    }

  return (
    <Group justify="center" gap="xs">
        <Avatar src={artist.image} alt={artist.name}/>
        <Group justify="center" gap="6px">
            <Text size="lg" c="gray.1" fw={700}>{artist.name}</Text>
            <Text size="lg">related artists</Text>
        </Group>
    </Group>
  )
}

export default RelatedArtistsTitle