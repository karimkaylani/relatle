'use client'

import React, { createContext, useEffect, useState } from 'react'
import ArtistCard from './ArtistCard'
import GameOver from './GameOver'
import Reset from './Reset'
import { Flex, SimpleGrid, Text } from '@mantine/core'

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
    resets: number
}

const readLocalStroage = (): SaveProps|null => {
    const item = localStorage.getItem("props");
    if (item === null) {
        return null;
    }
    return JSON.parse(item) as SaveProps;
}

export const GameContext = createContext<GameContextType|null>(null)

const Game = (props: GameProps) => {
    // localStorage.clear()
    const {web, matchup} = props
    const [start, end] = matchup
    const localSave = readLocalStroage();
    const [currArtist, setCurrArtist] = useState<Artist>(localSave?.currArtist ?? web[start])
    const [path, setPath] = useState<string[]>(localSave?.path ?? [currArtist.name])
    const [won, setWon] = useState<boolean>(localSave?.won ?? false)
    const [guesses, setGuesses] = useState<number>(localSave?.guesses ?? 0)
    const [resets, setResets] = useState<number>(localSave?.resets ?? 0)
    
    const save = (): void => {
        console.log('here')
        const curr: SaveProps = {
            currArtist, path, won, guesses, resets
        } 
        localStorage.setItem("props", JSON.stringify(curr));
    }

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

    return (
        <Flex 
        align="center"
        direction="column"
        gap="xl"
        className="mt-5">
            <Text size="45px">relatle</Text>
            <Text size="25px">{`${currArtist.name} => ${end}`}</Text>
            <Text size="20px">Guesses:{guesses} Resets:{resets}</Text>
            {won ? <GameOver won={won} path={path} guesses={guesses} matchup={matchup} resets={resets}/> :
            <SimpleGrid className='mt-5' 
            cols={{ base: 2, sm: 3, lg: 5 }}
            spacing={{ base: 10, sm: 'xl' }}>
            {currArtist.related.map(artist_name => 
                <ArtistCard key={web[artist_name].id} artist={web[artist_name]}
                updateArtistHandler={updateArtistHandler}/>)}
            </SimpleGrid>}
            <Reset resetHandler={resetHandler}/>
        </Flex>
    )
}

export default Game