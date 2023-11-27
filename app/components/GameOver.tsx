import React from 'react'
import { Artist } from './Game'

export interface GameOverProps {
    path: string[],
    guesses: number,
    matchup: string[],
    resets: number
}

const GameOver = (props: GameOverProps) => {
    const {path, guesses, matchup, resets} = props
    const [start, end] = matchup
  return (
    <div className="GameOver">
        <h2>You win!</h2>
        <h3>You got from {start} to {end} in {guesses} guesses with {resets} resets</h3>
        <h3>Your path: {path.join("→")}</h3>
    </div>
  )
}

export default GameOver