'use client'

import React, { Component, createContext, useEffect, useRef, useState } from 'react'
import ArtistCard from './ArtistCard'
import GameOver from './GameOver'
import Reset from './Reset'
import { Flex, SimpleGrid, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

export interface Artist {
    name: string,
    id: string,
    image: string,
    related: string[]
}

export interface GameContextType {
    web: {[key: string]: Artist},
    matchup: string[],
    currArtist: Artist,
}

interface GameProps {
    web: {[key: string]: Artist},
    matchup: string[]
}

interface SaveProps {
    currArtist: Artist,
    path: string[],
    won: boolean,
    guesses: number,
    resets: number,
    matchup: string[]
}

const readLocalStroage = (matchup: string[]): SaveProps|null => {
    // Ensure page is mounted to client before trying to read localStorage
    const item = localStorage.getItem("props");
    if (item === null) {
        return null
    }
    const saveData = JSON.parse(item) as SaveProps;
    return JSON.stringify(saveData.matchup) == JSON.stringify(matchup) ? saveData : null
}

export const GameContext = createContext<GameContextType|null>(null)

const Game = (props: GameProps) => {
    const {web, matchup} = props
    const [start, end] = matchup
    const [currArtist, setCurrArtist] = useState<Artist>(web[start])
    const [path, setPath] = useState<string[]>([currArtist.name])
    const [won, setWon] = useState<boolean>(false)
    const [guesses, setGuesses] = useState<number>(0)
    const [resets, setResets] = useState<number>(0)
    const [modalOpened, { open, close }] = useDisclosure(false)
    
    const save = (): void => {
        const curr: SaveProps = {
            currArtist, path, won, guesses, resets, matchup
        } 
        localStorage.setItem("props", JSON.stringify(curr));
    }

    const loadLocalStorageIntoState = ():void => {
        const localSave = readLocalStroage(matchup);
        if (localSave == null) {
            return
        }
        setCurrArtist(localSave.currArtist)
        setPath(localSave.path)
        setWon(localSave.won)
        setGuesses(localSave.guesses)
        setResets(localSave.resets)
        if (localSave.won) {
            open()
        }
    }

    // Ensure it only attempts to load localStorage when mounting
    const initialized = useRef(false)
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true 
            loadLocalStorageIntoState()
        }
    }, [])

    useEffect(() => {
        save()  
    })

    const updateArtistHandler = (artist: Artist): void => {
        if (won === true) {
            return
        }
        setPath([...path, artist.name])
        setGuesses(guesses + 1)
        if (artist.name === end) {
            setWon(true)
            open()
            return
        }
        setCurrArtist(artist)
    }

    const resetHandler = (): void => {
        if (won === true || currArtist.name == start) {
            return
        }
        setPath([...path, "RESET", start])
        setResets(resets + 1)
        setCurrArtist(web[start])
    }

    // Don't render if not initialized yet
    if (!initialized.current) {
        return null
    }

    return (
        <Flex 
        align="center"
        direction="column"
        gap="xl"
        className="mt-5">
            <Text ta="center" size="45px">relatle</Text>
            <Text ta="center" size="25px">{`${start} => ${end}`}</Text>
            <Text ta="center" size="20px">Guesses:{guesses}<br/><br/>Resets:{resets}</Text>
            <Text ta="center" size="lg"><b>{currArtist.name}&apos;s</b> Related Artists:</Text>
            <GameOver opened={modalOpened} close={close} path={path} guesses={guesses} matchup={matchup} resets={resets}/>
            <SimpleGrid 
            cols={{ base: 2, sm: 3, lg: 5 }}>
            {currArtist.related.map(artist_name => 
                <ArtistCard key={web[artist_name].id} artist={web[artist_name]}
                updateArtistHandler={updateArtistHandler}/>)}
            </SimpleGrid>
            {!won ? <Reset resetHandler={resetHandler}/> : null}
        </Flex>
    )
}

export default Game