'use client'

import React, { createContext, useState } from 'react'
import ArtistCard from './ArtistCard'

export interface Artist {
    name: string,
    id: string,
    image: string,
    related: string[]
}

export interface GameContextType {
    artists: string[],
    setArtists: (artists: string[]) => void
}

export const GameContext = createContext<GameContextType|null>(null)

const Game = (props:
        {web: {[key: string]: Artist}, matchup: string[]}) => {
    const {web, matchup} = props
    const [start, end] = matchup
    const [artists, setArtists] = useState(web[start]['related'])
    return (
        <div className="Game">
            <GameContext.Provider value={{artists, setArtists}}>
                <ArtistCard/>
            </GameContext.Provider>
        </div>
    )
}

export default Game