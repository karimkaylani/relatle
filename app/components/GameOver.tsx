import React from 'react'
import { Artist } from './Game'

export interface GameOverProps {
    path: Artist[]
}

const GameOver = (props: GameOverProps) => {
  return (
    <h2>You win!</h2>
  )
}

export default GameOver