import React from 'react'
import { Artist } from './Game'
import { Modal, Text, Flex, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

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
    onClose={close} centered>
      <Flex 
          align="center"
          direction="column"
          gap="xl">
        <Text ta="center" size="lg">You win!</Text>
        <Text ta="center" size="md">You got from {start} to {end} in {guesses} guesses with {resets} resets</Text>
        <Text ta="center" size="sm">Your path: <br></br>{path.join("→")}</Text>
        <Button size="md" variant="filled" color="teal">Share</Button>
        <Text ta="center" size="sm">Time until next game: </Text>
      </Flex>
    </Modal>
  )
}

export default GameOver