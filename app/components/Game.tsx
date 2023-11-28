'use client'

import React, { createContext, useState } from 'react'
import ArtistCard from './ArtistCard'
import GameOver from './GameOver'
import Reset from './Reset'

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
    const [path, setPath] = useState([currArtist.name])
    const [won, setWon] = useState(false)
    const [guesses, setGuesses] = useState(0)
    const [resets, setResets] = useState(0)
    
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

    if (won) {
        return <GameOver path={path} guesses={guesses} matchup={matchup} resets={resets}/>    
    }

    return (
        <div className="Game">
            <h2>{`${currArtist.name} => ${end}`}</h2>
                {currArtist.related.map(artist_name => 
                    <ArtistCard key={web[artist_name].id} artist={web[artist_name]}
                    updateArtistHandler={updateArtistHandler}/>)}
            <Reset resetHandler={resetHandler}/>
        </div>
    )
}

export default Game