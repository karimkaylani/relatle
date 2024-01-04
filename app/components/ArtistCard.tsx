import React, { useEffect, useRef, useState } from 'react'
import { Artist, phoneMaxWidth } from './Game'
import { Card, Image, Text, Flex, BackgroundImage, RingProgress, Center, Transition, Overlay } from '@mantine/core';
import { motion, useAnimate } from 'framer-motion'
import { useLongPress } from 'use-long-press';
import Lottie from 'lottie-react'
import waveAnimation from '../audioWave.json'


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
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const [resetAudioTimer, setResetAudioTimer] = useState<NodeJS.Timeout | null>(null);
  // To get up-to-date value of isPlaying in resetAudioTimer
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);


  const startMusic = () => {
    if (!audioRef.current) { return }
    audioRef.current.play()
    audioRef.current.volume = 0.5
    setIsPlaying(true)
    resetAudioTimer && clearTimeout(resetAudioTimer)
    setResetAudioTimer(null)
  }


  const stopMusic = () => {
    if (!audioRef.current) { return }
    audioRef.current.pause();
    setIsPlaying(false)
    // Reset audio after set time if audio hasn't been played again
    setResetAudioTimer(setTimeout(() => {
      if (audioRef.current && !isPlayingRef.current) {
        audioRef.current.currentTime = 0;
        setProgress(0)
      }
    }, 5000))
  }

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (resetAudioTimer) {
        clearTimeout(resetAudioTimer);
      }
    }
  }, [resetAudioTimer])

  const onTimeUpdate = () => {
    if (!audioRef.current) { return }
    requestAnimationFrame(onTimeUpdate);
    setProgress(((audioRef.current.currentTime ?? 0) / audioRef.current.duration) * 100)
  }

  const bind = useLongPress(() => {
    startMusic()
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
              width: window.innerWidth > phoneMaxWidth ? "192px" : window.innerWidth > 345 ? "160px" : "",
              userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none'
            }
          }}>
            <Flex align="center" direction="column"
              justify="center" gap="0px">
                <Card.Section inheritPadding>
                  <BackgroundImage className='pt-5' draggable={false}
                  radius="sm" src={artist.image} w={img_size} h={img_size}
                  styles={{root: {userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none'}}}>
                    {isPlaying && <Overlay backgroundOpacity={0.5}/>}
                    <Center>
                    <Transition
                      mounted={isPlaying}
                      transition="fade"
                      duration={400}
                      timingFunction="ease">
                      {(styles) => 
                      <RingProgress thickness={5} style={styles} styles={{root: {zIndex: 1000}}}
                      sections={[{ value: progress, color: 'gray.1' }]}
                      label={
                        <Center>
                          <Lottie animationData={waveAnimation}
                          style={{width: 50}}/>
                        </Center>
                      }/>}
                    </Transition>
                    </Center>
                  </BackgroundImage>
                
                </Card.Section>
                <Text c={path.includes(artist.name) && artist.name !== end ? "gray.5" : "gray.1"} fw={700} size={text_size} mt="md" ta="center"
                styles={{root: {userSelect: 'none', WebkitUserSelect: 'none'}}}>
                  {artist.name}
                </Text>
            </Flex>
            <audio loop ref={audioRef} src={artist.top_song_preview_url}
            onTimeUpdate={onTimeUpdate}/>
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