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
    end: string,
    clicked: boolean,
    setClicked: (clicked: boolean) => void,
    clickable?: boolean
}

const ArtistCard = ({artist, updateArtistHandler, path, won,
  end, clicked, setClicked, clickable=true}:ArtistCardProps) => {
  let img_size = window.innerWidth > phoneMaxWidth ? 175 : 140
  let text_size = window.innerWidth > phoneMaxWidth ? "md" : "sm"

  const [scope, animate] = useAnimate()

  const clickArtistHandler = (artist: Artist) => {
    if (clicked) { return }
    setClicked(true)
    const winningGuess = artist.name === end
    const borderSize = winningGuess ? "4px" : "2px"
    const borderColor = winningGuess ? "#51cf66" : "#f1f3f5"
    animate([
      [scope.current, {border: `${borderSize} solid ${borderColor}`}, {duration: 0.3}],
      [scope.current, {border: `${borderSize} solid ${borderColor}`}, {duration: winningGuess ? 0.6 : 0.3}]
    ], {
      ease: "linear",
      onComplete: () => {
        updateArtistHandler(artist)
        animate([[scope.current, {border: `0px solid ${borderColor}`}, {duration: 0.3}]])
      }
    })
  }

  const artistCardContent = () => {
    return (
        <Card ref={scope}
          shadow="sm" radius="md" withBorder
          padding="xs" opacity={won && artist.name !== end ? 0.25 : 1}
          styles={{
            root: {
              width: window.innerWidth > phoneMaxWidth ? "192px" : window.innerWidth > 345 ? "160px" : ""
            }
          }}>
            <Flex align="center" direction="column"
              justify="center" gap="0px">
                <Card.Section inheritPadding>
                  <Image fallbackSrc={`https://ui-avatars.com/api/?background=212529&color=f1f3f5&name=${encodeURIComponent(artist.name)}`} radius="sm" src={artist.image} w={img_size} h={img_size} alt={artist.name} />
                </Card.Section>
                <Text c={path.includes(artist.name) && artist.name !== end ? "gray.5" : "gray.1"} fw={700} size={text_size} mt="md" ta="center">
                  {artist.name}
                </Text>
            </Flex>
        </Card>
    ) 
  }

  return (
    clickable ?
    <HoverButton onTap={() => won ? updateArtistHandler(artist) : clickArtistHandler(artist)}>
      {artistCardContent()}
    </HoverButton>
    :
    artistCardContent()
  )
}

export default ArtistCard