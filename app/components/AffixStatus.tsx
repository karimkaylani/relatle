'use client'
import React, { useEffect, useState } from 'react'
import { Artist } from './Game'
import { Affix, Card, Group, ScrollArea, Text, Transition } from '@mantine/core'
import ArtistInfo from './ArtistInfo'
import Arrow from './Arrow'

export interface AffixStatusProps {
    currArtist: Artist,
    endArtist: Artist,
    path: string[],
    guesses: number,
    resets: number,
    mounted: boolean|undefined
}

const AffixStatus = (props: AffixStatusProps) => {
    const {currArtist, endArtist, path, guesses, resets, mounted} = props
    const groupRef = React.useRef<HTMLDivElement>(null)
    const [isWrapped, setIsWrapped] = useState(false)
    const singleLineHeight = 46

    const checkIfWrapped = () => { 
        const current = groupRef.current
        if (current) {
            setIsWrapped(current.clientHeight !== undefined && current.clientHeight > singleLineHeight)
        }
    }

    useEffect(() => {
        window.addEventListener('resize', checkIfWrapped);
        checkIfWrapped()

        return () => {
            window.removeEventListener('resize', checkIfWrapped);
        }
    }, [mounted, guesses])
  return (
    <Affix w="100%" h={0} top={0}>
        <Transition transition="slide-down" mounted={mounted === true}>
        {(transitionStyles) => (
            <Card ref={groupRef} p="xs" withBorder style={transitionStyles}>
                <Group align='center' justify={isWrapped ? "center" : "space-between"} wrap='nowrap'>
                    <Group align='center' justify="center" gap="xs" wrap='nowrap'>
                        <ArtistInfo artist={currArtist} small={true} />
                        <Arrow small={true}/>
                        <ArtistInfo artist={endArtist} small={true} is_green={true}/>
                    </Group>
                    <Text>{guesses} {!isWrapped ? "|" : ""} {resets}</Text>
                </Group>
            </Card> 
        )}
        </Transition>
    </Affix>
  )
}

export default AffixStatus