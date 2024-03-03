'use client'
import React, { useEffect, useState } from 'react'
import { Artist, PlayingAudioContext } from './Game'
import { Affix, Avatar, Card, Group, ScrollArea, Text, Transition } from '@mantine/core'
import ArtistInfo from './ArtistInfo'
import Arrow from './Arrow'

export interface AffixStatusProps {
    currArtist: Artist,
    endArtist: Artist,
    guesses: number,
    resets: number,
    scrolled: boolean|undefined,
    onTap: () => void
}

const AffixStatus = (props: AffixStatusProps) => {
    const {currArtist, endArtist, guesses, resets, scrolled, onTap} = props
    const groupRef = React.useRef<HTMLDivElement>(null)

    const {playingAudio, setPlayingAudio, playingArtist, setPlayingArtist} = React.useContext(PlayingAudioContext)
    const mounted = scrolled === true || playingAudio !== null

  return (
    <Affix w="100%" h={0} top={0}>
        <Transition transition="slide-down" mounted={mounted}>
        {(transitionStyles) => (
            <Card onClick={onTap} ref={groupRef} p="xs" withBorder styles={{root: {maxHeight: '100px', overflow: 'auto'}}} style={transitionStyles}>

                {playingAudio && playingArtist && 
                <Group justify='center' align='center' gap='5px'>
                    <Text ta='center'>Playing</Text>
                    <Avatar radius='sm' size={'sm'} src={playingArtist.top_song_art} alt={playingArtist.top_song_name + "art"}/>
                    <Text ta='center' c='green.6' fw={700}>{playingArtist.top_song_name}</Text>
                    <Text ta='center'>by</Text>
                    <ArtistInfo artist={playingArtist} small={true}/>
                </Group>}

                {!playingAudio && scrolled &&
                <Group align='center' justify='space-between' wrap='nowrap'>
                    <Group align='center' justify="center" gap="xs" wrap='nowrap'>
                        <ArtistInfo artist={currArtist} small={true}/>
                        <Arrow small={true}/>
                        <ArtistInfo artist={endArtist} small={true} is_green={true}/>
                    </Group>
                    <Text>{guesses} | {resets}</Text>
                </Group>}
            </Card> 
        )}
        </Transition>
    </Affix>
  )
}

export default AffixStatus