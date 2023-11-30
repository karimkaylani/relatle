import React from 'react'
import { Modal, Text, Flex, Button } from '@mantine/core'
import Share from './Share'
import { Artist } from './Game'
import Matchup from './Matchup'
import ScrollablePath from './ScrollablePath'

export interface GameOverProps {
    opened: boolean,
    close: () => void,
    path: string[],
    guesses: number,
    matchup: string[],
    resets: number,
    web: {[key: string]: Artist}
}

const GameOver = (props: GameOverProps) => {
    const {opened, close, path, guesses, matchup, resets, web} = props
    const [start, end] = matchup
  return (
    <Modal opened={opened} 
    onClose={close} withCloseButton={false} centered
    styles={{ title: { fontSize: "20px", fontWeight: "bold" } }}>
      <Flex 
          align="center"
          direction="column"
          gap="lg">
        <Text c="gray.1" size="25px" fw={700}>You Win!</Text>
        <Matchup start={start} end={end} start_img={web[start].image} end_img={web[end].image}></Matchup>
        <Text ta="center" size="sm">Your Path</Text>
        <ScrollablePath matchup={matchup} web={web} path={path}></ScrollablePath>
        <Share path={path} guesses={guesses} matchup={matchup} resets={resets}/>
      </Flex>
    </Modal>
  )
}

export default GameOver