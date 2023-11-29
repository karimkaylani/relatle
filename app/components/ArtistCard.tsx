import React from 'react'
import { Artist } from './Game'
import { Button, Card, Image, Text, Center, Flex } from '@mantine/core';
import { motion } from "framer-motion"

interface ArtistCardProps {
    artist: Artist,
    updateArtistHandler: (artist: Artist) => void
}

const ArtistCard = (props: ArtistCardProps) => {
  const {artist, updateArtistHandler} = props
  return (
    <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.9 }}
    onTap={() => updateArtistHandler(artist)}>
      <Card
        shadow="sm"
        radius="md" withBorder
        padding="xs"
        component="a">
          <Flex 
            align="center"
            direction="column"
            gap="0px">
            <Card.Section inheritPadding>
              <Image radius="md" src={artist.image} w={175} h={175} alt={artist.name} />
            </Card.Section>
            <Text fw={500} size="lg" mt="md" ta="center">
              {artist.name}
            </Text>
          </Flex>
      </Card>
    </motion.button>
  )
}

export default ArtistCard