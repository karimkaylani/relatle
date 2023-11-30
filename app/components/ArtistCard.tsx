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
  const phoneMaxWidth = 500
  return (
    <motion.button
    whileHover={window.innerWidth > phoneMaxWidth ? { scale: 1.05 } : {}}
    whileTap={{ scale: 0.95 }}
    onTap={() => updateArtistHandler(artist)}>
      <Card
        shadow="sm"
        radius="md" withBorder
        padding="xs"
        className={window.innerWidth > phoneMaxWidth ? "w-48" : ""}
        >
          <Flex 
            align="center"
            direction="column"
            gap="0px">
            <Card.Section inheritPadding>
              <Image radius="md" src={artist.image} w={175} h={175} alt={artist.name} />
            <Text c="gray.1" fw={700} size="lg" mt="md" ta="center">
              {artist.name}
            </Text>
            </Card.Section>
          </Flex>
      </Card>
    </motion.button>
  )
}

export default ArtistCard