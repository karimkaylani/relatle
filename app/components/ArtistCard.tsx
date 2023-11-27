import React from 'react'
import { Artist } from './Game'
import { Button } from '@mantine/core';

interface ArtistCardProps {
    artist: Artist,
    updateArtistHandler: (artist: Artist) => void
}

const ArtistCard = (props: ArtistCardProps) => {
    const {artist, updateArtistHandler} = props
  return (
    <div>
        <Button className="mt-2" onClick={() => updateArtistHandler(artist)}>{artist.name}</Button>
    </div>
  )
}

export default ArtistCard