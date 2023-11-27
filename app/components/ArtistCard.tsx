import React from 'react'
import { Artist } from './Game'

interface ArtistCardProps {
    artist: Artist,
    updateArtistHandler: (artist: Artist) => void
}

const ArtistCard = (props: ArtistCardProps) => {
    const {artist, updateArtistHandler} = props
  return (
    <div>
        <button onClick={() => updateArtistHandler(artist)}>{artist.name}</button>
    </div>
  )
}

export default ArtistCard