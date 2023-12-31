'use client'
import React, { useEffect, useState } from 'react'
import { Artist } from './Game'
import { Affix, Card, Group, ScrollArea, Text, Transition } from '@mantine/core'
import ArtistInfo from './ArtistInfo'
import Arrow from './Arrow'

export interface AffixStatusProps {
    currArtist: Artist,
    endArtist: Artist,
    guesses: number,
    resets: number,
    mounted: boolean|undefined,
    onTap: () => void
}

const AffixStatus = (props: AffixStatusProps) => {
    const {currArtist, endArtist, guesses, resets, mounted, onTap} = props
    const groupRef = React.useRef<HTMLDivElement>(null)

  return (
    <Affix w="100%" h={0} top={0}>
        <Transition transition="slide-down" mounted={mounted === true}>
        {(transitionStyles) => (
            <Card onClick={onTap} ref={groupRef} p="xs" withBorder style={transitionStyles}>
                <Group align='center' justify='space-between' wrap='nowrap'>
                    <Group align='center' justify="center" gap="xs" wrap='nowrap'>
                        <ArtistInfo artist={currArtist} small={true} />
                        <Arrow small={true}/>
                        <ArtistInfo artist={endArtist} small={true} is_green={true}/>
                    </Group>
                    <Text>{guesses} | {resets}</Text>
                </Group>
            </Card> 
        )}
        </Transition>
    </Affix>
  )
}

export default AffixStatus