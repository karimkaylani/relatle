import React, { useContext } from 'react'
import Game, { Artist, GameContext } from './Game'

interface ArtistCardProps {
    artist: Artist,
    updateArtistHandler: (artist: Artist) => void
}

const ArtistCard = (props: ArtistCardProps) => {
    let context = useContext(GameContext)
    if (!context) {
        return
    }
    let {web, matchup, currArtist} = context
    const {artist, updateArtistHandler} = props
  return (
    <div>
        <button onClick={() => updateArtistHandler(artist)}>{artist.name}</button>
    </div>
  )
}

export default ArtistCard