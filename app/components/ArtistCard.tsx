import React from 'react'
import { Artist, phoneMaxWidth } from './Game'
import { Card, Image, Text, Flex } from '@mantine/core';
import HoverButton from './HoverButton';
import { motion, useAnimate, useAnimationControls } from 'framer-motion'

interface ArtistCardProps {
    artist: Artist,
    updateArtistHandler: (artist: Artist) => void,
    path: string[],
    won: boolean,
    end: string
}

const ArtistCard = (props: ArtistCardProps) => {
  const {artist, updateArtistHandler, path, won, end} = props
  let img_size = window.innerWidth > phoneMaxWidth ? 175 : 140
  let text_size = window.innerWidth > phoneMaxWidth ? "md" : "sm"

  const [scope, animate] = useAnimate()

  const clickArtistHandler = (artist: Artist) => {
    const borderColor = artist.name === end ? "#51cf66" : "#f1f3f5"
    animate([
      [scope.current, {border: `2px solid ${borderColor}`}],
      [scope.current, {border: `2px solid ${borderColor}`}],
      artist.name === end ? [scope.current, {border: `0px solid ${borderColor}`}] : [],
    ], {
      ease: "linear",
      onComplete: () => updateArtistHandler(artist)
    })

  }

  return (
      <HoverButton onTap={() => won ? updateArtistHandler(artist) : clickArtistHandler(artist)}>
        <Card ref={scope}
          shadow="sm" radius="md" withBorder
          padding="xs" opacity={won && artist.name !== end ? 0.25 : 1}
          styles={{
            root: {
              width: window.innerWidth > phoneMaxWidth ? "192px" : window.innerWidth > 345 ? "160px" : ""
            }
          }}>
            <Flex 
              align="center" direction="column"
              justify="center" gap="0px">
                <Card.Section inheritPadding>
                  <Image radius="sm" src={artist.image} w={img_size} h={img_size} alt={artist.name} />
                </Card.Section>
                <Text c={path.includes(artist.name) && artist.name !== end ? "gray.5" : "gray.1"} fw={700} size={text_size} mt="md" ta="center">
                  {artist.name}
                </Text>
            </Flex>
        </Card>
      </HoverButton>
  )
}

export default ArtistCard