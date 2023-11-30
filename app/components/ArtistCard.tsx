import React from 'react'
import { Artist, phoneMaxWidth } from './Game'
import { Card, Image, Text, Flex } from '@mantine/core';
import HoverButton from './HoverButton';

interface ArtistCardProps {
    artist: Artist,
    updateArtistHandler: (artist: Artist) => void,
    path: string[],
    won: boolean,
    end: string
}

const ArtistCard = (props: ArtistCardProps) => {
  const {artist, updateArtistHandler, path, won, end} = props
  return (
    <HoverButton onTap={() => updateArtistHandler(artist)}>
      <Card
        shadow="sm"
        radius="md" withBorder
        padding="xs"
        opacity={won && artist.name !== end ? 0.25 : 1}
        className={window.innerWidth > phoneMaxWidth ? "w-48" : ""}
        >
          <Flex 
            align="center"
            direction="column"
            gap="0px">
            <Card.Section inheritPadding>
              <Image radius="md" src={artist.image} w={175} h={175} alt={artist.name} />
            <Text c={path.includes(artist.name) && artist.name !== end ? "gray.5" : "gray.1"} fw={700} size="lg" mt="md" ta="center">
              {artist.name}
            </Text>
            </Card.Section>
          </Flex>
      </Card>
    </HoverButton>
  )
}

export default ArtistCard