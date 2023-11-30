import React from 'react'
import { Modal, Text, Flex, Button, Group } from '@mantine/core'
import ShareResults from './ShareResults'
import { Artist } from './Game'
import Matchup from './Matchup'
import ScrollablePath from './ScrollablePath'
import ArtistInfo from './ArtistInfo'
import GuessesResets from './GuessesResets'
import SharePath from './SharePath'

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
    padding="lg" radius="lg"
    styles={{ title: { fontSize: "20px", fontWeight: "bold" } }}>
      <Flex 
          align="center"
          direction="column"
          gap="lg">
        <Text c="gray.1" size="25px" fw={700}>You Win!</Text>
        <Group justify="center">
          <ArtistInfo artist={web[start]} small={true} is_green={false}></ArtistInfo>
          <Text fw={500} c="gray.1" size="25px">→</Text>
          <ArtistInfo artist={web[end]} small={true} is_green={true}></ArtistInfo>
        </Group>
        <GuessesResets guesses={guesses} resets={resets}/>
        <Text ta="center" size="sm">Your Path</Text>
        <ScrollablePath matchup={matchup} web={web} path={path}></ScrollablePath>
        <Group justify="center">
          <SharePath path={path}/>
          <ShareResults path={path} guesses={guesses} matchup={matchup} resets={resets}/>
        </Group>
      </Flex>
    </Modal>
  )
}

export default GameOver