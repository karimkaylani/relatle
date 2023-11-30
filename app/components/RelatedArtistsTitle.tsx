import React from 'react'
import { Artist } from './Game'
import { Avatar, Group, Text } from '@mantine/core'

export interface RelatedArtistsTitleProps {
    artist: Artist
}

const RelatedArtistsTitle = (props: RelatedArtistsTitleProps) => {
    const {artist} = props
  return (
    <Group justify="center" gap="xs">
        <Avatar src={artist.image} alt={artist.name}/>
        <Group justify="center" gap="6px">
            <Text size="xl" c="gray.1" fw={700}>{artist.name}</Text>
            <Text size="xl">related artists</Text>
        </Group>
    </Group>
  )
}

export default RelatedArtistsTitle