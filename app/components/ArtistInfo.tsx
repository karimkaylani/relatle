import React, { Fragment } from 'react'
import { Artist } from './Game'
import { Group, Avatar, Text } from '@mantine/core'

export interface ArtistInfoProps {
    artist: Artist,
    small: boolean,
    is_green?: boolean
}

const ArtistInfo = ({artist, small, is_green=false}: ArtistInfoProps) => {
  return (
    <Group justify="flex-start" gap="xs">
        {!is_green ?
        <Fragment>
            <Avatar size={small ? "sm" : ""} src={artist.image} alt={artist.name}/>
            <Text c="gray.1" size={small ? "13px" : "lg"} fw={700}>{artist.name}</Text>
        </Fragment>  :
        <Fragment>
            <Avatar size={small ? "sm" : ""} src={artist.image} alt={artist.name}
            styles={{
                image: { border: '2.5px solid #51cf66', borderRadius: "100%"  }
            }}/> 
            <Text c="green.5" size={small ? "13px" : "lg"} fw={700}>{artist.name}</Text>
        </Fragment>
        }   
    </Group>
  )
}

export default ArtistInfo