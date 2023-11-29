import React from 'react'
import { Modal, Text, Flex, Button } from '@mantine/core'
import Share from './Share'

export interface GameOverProps {
    opened: boolean,
    close: () => void,
    path: string[],
    guesses: number,
    matchup: string[],
    resets: number
}

const GameOver = (props: GameOverProps) => {
    const {opened, close, path, guesses, matchup, resets} = props
    const [start, end] = matchup
  return (
    <Modal opened={opened} 
    onClose={close} title="You win!" centered
    styles={{ title: { fontSize: "20px", fontWeight: "bold" } }}>
      <Flex 
          align="center"
          direction="column"
          gap="lg">
        <Text ta="center" size="md">You got from {start} to {end} in {guesses} guesses with {resets} resets</Text>
        <Text ta="center" size="sm">Your path: <br></br>{path.join("→")}</Text>
        <Share path={path} guesses={guesses} matchup={matchup} resets={resets}/>
      </Flex>
    </Modal>
  )
}

export default GameOver