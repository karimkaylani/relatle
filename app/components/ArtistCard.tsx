import React, { useState } from 'react'
import { Artist, phoneMaxWidth } from './Game'
import { Card, Image, Text, Flex } from '@mantine/core';
import HoverButton from './HoverButton';
import { motion, useAnimate, useAnimationControls } from 'framer-motion'
import { useLongPress } from 'use-long-press';

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
  end, clicked, setClicked, clickable=true}: ArtistCardProps) => {
  let img_size = window.innerWidth > phoneMaxWidth ? 175 : 140
  let text_size = window.innerWidth > phoneMaxWidth ? "md" : "sm"

  const [scope, animate] = useAnimate()
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isLongPress, setLongPress] = useState(false);

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  const bind = useLongPress(() => {
    audioRef.current?.play()
    setLongPress(true)
  }, {
    onFinish: () => {
      stopMusic()
    },
    onCancel: () => {
      stopMusic()
      setLongPress(false)
    }
  })

  const clickArtistHandler = () => {
    if (clicked || isLongPress) { return }
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
                  <Image draggable={false} fallbackSrc={`https://ui-avatars.com/api/?background=212529&color=f1f3f5&name=${encodeURIComponent(artist.name)}`}
                  radius="sm" src={artist.image} w={img_size} h={img_size} alt={artist.name}
                  styles={{root: {userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none'}}}/>
                </Card.Section>
                <Text c={path.includes(artist.name) && artist.name !== end ? "gray.5" : "gray.1"} fw={700} size={text_size} mt="md" ta="center"
                styles={{root: {userSelect: 'none', WebkitUserSelect: 'none'}}}>
                  {artist.name}
                </Text>
            </Flex>
            <audio ref={audioRef} src={artist.top_song_preview_url} />
        </Card>
    ) 
  }

  return (
    clickable ?
    <motion.button {...bind()}
        whileHover={window.innerWidth > phoneMaxWidth ? { scale: 1.05 } : {scale: 1.03}}
        whileTap={{ scale: 0.95 }}
        onTap={() => won ? updateArtistHandler(artist) : clickArtistHandler()}
        onTouchEnd={() => setLongPress(false)}
        onMouseUp={() => setLongPress(false)}>

        {artistCardContent()}
    </motion.button>
    :
    artistCardContent()
  )
}

export default ArtistCard