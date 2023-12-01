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

interface GameProps {
    web: {[key: string]: Artist},
    matchups: {[key: string]: string[]}
}

interface SaveProps {
    currArtist: Artist,
    path: string[],
    won: boolean,
    guesses: number,
    resets: number,
    matchup: string[]
}

const readLocalStroage = (): SaveProps|null => {
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

const getTodaysMatchup = (matchups: {[key: string]: string[]}): string[] => {
    const defaultDate = "11/29/2023"
    const today = new Date()
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    return matchups[formattedDate] ?? matchups[defaultDate]
}

const Game = (props: GameProps) => {
    const {web, matchups} = props
    const [matchup, setMatchup] = useState<any>(null)
    const [currArtist, setCurrArtist] = useState<any>(null)
    const [path, setPath] = useState<any>(null)
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

    const loadLocalStorageIntoState = (todayMatchup: string[]):void => {
        const localSave = readLocalStroage();
        if (localSave == null) {
            htpModalOpen()
            return
        }
        if (JSON.stringify(localSave.matchup) !== JSON.stringify(todayMatchup)) {
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
        // Put in here to ensure we're getting client time,
        // as well as all other state variables that rely
        // on our matchup
        let todayMatchup = getTodaysMatchup(matchups)
        setMatchup(todayMatchup)
        setCurrArtist(web[todayMatchup[0]])
        setPath([todayMatchup[0]])
        loadLocalStorageIntoState(todayMatchup)
        setLoading(false)
    }, [])

    if (loading) {
        return null;
    }

    const [start, end] = matchup

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
            {currArtist.related.map((artist_name: string) => 
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