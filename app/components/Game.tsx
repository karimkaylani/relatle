'use client'

import React, { createContext, useState } from 'react'
import ArtistCard from './ArtistCard'
import GameOver from './GameOver'

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

export const GameContext = createContext<GameContextType|null>(null)

const Game = (props: GameProps) => {
    const {web, matchup} = props
    const [start, end] = matchup
    const [currArtist, setCurrArtist] = useState(web[start])
    const [path, setPath] = useState([currArtist])
    const [won, setWon] = useState(false)
    
    let guesses = 0
    const updateArtistHandler = (artist: Artist): void => {
        if (won === true) {
            return
        }
        setPath([...path, artist])
        guesses += 1
        if (artist.name === end) {
            setWon(true)
            return
        }
        setCurrArtist(artist)
    }

    return (
        <div className="Game">
            <h2>{`${currArtist.name} => ${end}`}</h2>
            <GameContext.Provider value={{web, matchup, currArtist}}>
                {currArtist.related.map(artist_name => 
                <ArtistCard artist={web[artist_name]} updateArtistHandler={updateArtistHandler}/>)}
            </GameContext.Provider>
        </div>
    )
}

export default Game