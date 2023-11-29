'use client'

import React, { createContext, useEffect, useState } from 'react'
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
    return JSON.stringify(saveData.matchup) == JSON.stringify(matchup) ? saveData : null
}

// For testing purposes
function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

const getTodaysMatchup = (startDate: Date, matchups: string[][]): string[] => {
    const today = new Date();
    const oneDay = (1000 * 3600 * 24);
    const diff = Math.round((today.getTime() - startDate.getTime()) / oneDay);
    const index = Math.max(diff, 0) % matchups.length
    // return matchups[getRandomInt(0, matchups.length-1)]
    return matchups[index]
}

export const GameContext = createContext<GameContextType|null>(null)
const startDate = new Date("2023-11-27")

const Game = (props: GameProps) => {
    const {web, matchups} = props
    const matchup = getTodaysMatchup(startDate, matchups)
    const [start, end] = matchup
    const [currArtist, setCurrArtist] = useState<Artist>(web[start])
    const [path, setPath] = useState<string[]>([currArtist.name])
    const [won, setWon] = useState<boolean>(false)
    const [guesses, setGuesses] = useState<number>(0)
    const [resets, setResets] = useState<number>(0)
    const [modalOpened, { open, close }] = useDisclosure(false)
    
    const save = (saveData: SaveProps): void => { 
        localStorage.setItem("props", JSON.stringify(saveData));
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

    // When component first mounts, load in localStorage
    // use loading so that nothing renders until localStorage is checked
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        loadLocalStorageIntoState()
        setLoading(false)
    }, [])

    const updateArtistHandler = (artist: Artist): void => {
        if (won === true) {
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
            open()
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
        className="mt-5">
            <Text ta="center" size="45px">relatle</Text>
            <Text ta="center" size="25px">{`${start} => ${end}`}</Text>
            <Text ta="center" size="20px">Guesses: {guesses}<br/><br/>Resets: {resets}</Text>
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