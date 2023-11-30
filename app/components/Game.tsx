'use client'

import React, { createContext, useEffect, useState } from 'react'
import ArtistCard from './ArtistCard'
import GameOver from './GameOver'
import Reset from './Reset'
import { Flex, SimpleGrid, Text, Image, Anchor, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Matchup from './Matchup'
import Scoreboard from './Scoreboard'
import RelatedArtistsTitle from './RelatedArtistsTitle'
import HowToPlay from './HowToPlay'
import HoverButton from './HoverButton'

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
    matchups: string[][]
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
    return saveData
}

export const phoneMaxWidth = 500;

// For testing purposes
function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const startDate: Date = new Date("2023-11-29")
export const getDiffInDays = (): number => {
    const today = new Date();
    const oneDay = (1000 * 3600 * 24);
    const diff = Math.floor((today.getTime() - startDate.getTime()) / oneDay);
    return diff
}

const getTodaysMatchup = (matchups: string[][]): string[] => {
    const diff = getDiffInDays()
    const index = Math.max(diff, 0) % matchups.length
    // return matchups[getRandomInt(0, matchups.length-1)]
    return matchups[index]
}

export const GameContext = createContext<GameContextType|null>(null)

const Game = (props: GameProps) => {
    const {web, matchups} = props
    const matchup = getTodaysMatchup(matchups)
    const [start, end] = matchup
    const [currArtist, setCurrArtist] = useState<Artist>(web[start])
    const [path, setPath] = useState<string[]>([currArtist.name])
    const [won, setWon] = useState<boolean>(false)
    const [guesses, setGuesses] = useState<number>(0)
    const [resets, setResets] = useState<number>(0)
    const [winModalOpened, winModalHandlers] = useDisclosure(false)
    const {open: winModalOpen, close: winModalClose} = winModalHandlers
    const [htpModalOpened, htpModalHandlers] = useDisclosure(false);
    const {open: htpModalOpen} = htpModalHandlers
    
    const save = (saveData: SaveProps): void => { 
        localStorage.setItem("props", JSON.stringify(saveData));
    }

    const loadLocalStorageIntoState = ():void => {
        const localSave = readLocalStroage(matchup);
        if (localSave == null) {
            htpModalOpen()
            return
        }
        if (JSON.stringify(localSave.matchup) !== JSON.stringify(matchup)) {
            return
        }
        setCurrArtist(localSave.currArtist)
        setPath(localSave.path)
        setWon(localSave.won)
        setGuesses(localSave.guesses)
        setResets(localSave.resets)
        if (localSave.won) {
            winModalOpen()
        }
    }

    // When component first mounts, load in localStorage
    // use loading so that nothing renders until localStorage is checked
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        loadLocalStorageIntoState()
        setLoading(false)
    }, [])

    const updateArtistHandler = (artist: Artist): void => {
        if (won === true) {
            if (artist.name === end) { winModalOpen() }
            return
        }
        const newPath = [...path, artist.name]
        setPath(newPath)
        setGuesses(guesses + 1)
        if (artist.name === end) {
            setWon(true)
            save({
                currArtist, path: newPath, won:true,
                guesses: guesses+1, resets, matchup
            })
            winModalOpen()
            return
        }
        setCurrArtist(artist)
        save({
            currArtist: artist, path: newPath, won,
            guesses: guesses+1, resets, matchup
        })
    }

    const resetHandler = (): void => {
        if (won === true || currArtist.name == start) {
            return
        }
        const newPath = [...path, "RESET"]
        setPath(newPath)
        setResets(resets + 1)
        setCurrArtist(web[start])
        save({
            currArtist: web[start], path: newPath, won,
            guesses, resets: resets+1, matchup
        })
    }

    if (loading) {
        return null;
    }

    return (
        <Flex 
        align="center"
        direction="column"
        gap="xl"
        className="mt-5 pb-10 pl-5 pr-5">
            <Image w={250} src="logo.png" alt="logo"></Image>
            
            <Stack gap="xs">
                <Text ta="center">In as few guesses as you can,<br></br>use related artists to get from</Text>
                <Matchup start={web[start]} end={web[end]}></Matchup>
            </Stack>
            {won ? 
                <HoverButton onTap={winModalOpen}>
                    <Scoreboard guesses={guesses} resets={resets} greenBorder={won}/>
                </HoverButton>
                :
                <Scoreboard guesses={guesses} resets={resets} greenBorder={won}/>
            }
            <RelatedArtistsTitle artist={currArtist} won={won} endArtist={web[end]}/>
            <GameOver opened={winModalOpened} close={winModalClose} path={path} guesses={guesses} matchup={matchup} resets={resets} web={web}/>
            <SimpleGrid
            cols={{ base: 2, sm: 3, lg: 5 }}>
            {currArtist.related.map(artist_name => 
                <ArtistCard key={web[artist_name].id} artist={web[artist_name]} path={path} won={won} end={end}
                updateArtistHandler={updateArtistHandler}/>)}
            </SimpleGrid>
            {!won ? <Reset resetHandler={resetHandler}/> : null}
            <HowToPlay start={web[start]} end={web[end]} opened={htpModalOpened} handlers={htpModalHandlers}/>
            <Text>Built by <Anchor c="green.8" href="https://karimkaylani.com/" target="_blank">Karim Kaylani</Anchor>. 
            Designed by <Anchor c="green.8" href="https://zade.design/" target="_blank">Zade Kaylani</Anchor>.</Text>
        </Flex>
    )
}

export default Game