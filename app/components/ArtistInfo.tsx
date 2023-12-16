import React, { Fragment } from 'react'
import { Artist } from './Game'
import { Group, Avatar, Text } from '@mantine/core'

export interface ArtistInfoProps {
    artist: Artist,
    small: boolean,
    is_green?: boolean,
}

const ArtistInfo = ({artist, small, is_green=false}: ArtistInfoProps) => {
  return (
    <Group justify="center" gap="xs">
        <Avatar size={small ? "sm" : ""} src={artist.image} alt={artist.name}
            styles={is_green ? {
            image: { border: '2.5px solid #51cf66', borderRadius: "100%"  }
        } : {}}/>
        <Text c={is_green ? "green.5" : "gray.1"} size={small ? "13px" : "lg"} fw={700}>{artist.name}</Text>
    </Group>
  )
}

export default ArtistInfo