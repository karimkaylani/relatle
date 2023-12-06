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
  let img_size = window.innerWidth > phoneMaxWidth ? 175 : 145
  return (
    <HoverButton onTap={() => updateArtistHandler(artist)}>
      <Card
        shadow="sm"
        radius="md" withBorder
        padding="xs"
        opacity={won && artist.name !== end ? 0.25 : 1}
        styles={{
          root: {
            maxWidth: "192px"
          }
        }}
        >
          <Flex 
            align="center"
            direction="column"
            justify="center"
            gap="0px">
              <Card.Section>
                <Image radius="md" src={artist.image} w={img_size} h={img_size} alt={artist.name} />
              </Card.Section>
              <Text c={path.includes(artist.name) && artist.name !== end ? "gray.5" : "gray.1"} fw={700} size="lg" mt="md" ta="center">
                {artist.name}
              </Text>
          </Flex>
      </Card>
    </HoverButton>
  )
}

export default ArtistCard