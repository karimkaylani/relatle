'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Modal, Text, Flex, Group, Card, Collapse, Button, Space, Drawer } from '@mantine/core'
import ShareResults from './ShareResults'
import { Artist, phoneMaxWidth } from './Game'
import ScrollablePath from './ScrollablePath'
import Scoreboard from './Scoreboard'
import SharePath from './SharePath'
import * as Collections from 'typescript-collections';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react'
import { useDisclosure, useIntersection } from '@mantine/hooks'
import Matchup from './Matchup'
import { useSwipeable } from 'react-swipeable'
import { getAverageScore } from '../page'
import CountdownClock from './CountdownClock'

export interface GameOverProps {
    opened: boolean,
    close: () => void,
    path: string[],
    guesses: number,
    matchup: string[],
    resets: number,
    web: {[key: string]: Artist},
    is_custom: boolean,
    matchupID: number
}

const getMinPath = (web: {[key: string]: Artist}, start: string, end: string): string[] => {
  const visited: Set<string> = new Set();
  const queue: Collections.Queue<[string, string[]]> = new Collections.Queue();
  queue.enqueue([start, []]);

  while (!queue.isEmpty()) {
      const item = queue.dequeue();
      if (item === undefined) {
          return [];
      }
      const [node, path] = item
      if (node === end) {
          return path
      }
      if (!visited.has(node)) {
          visited.add(node);
          for (const neighbor of web[node].related || []) {
              queue.enqueue([neighbor, path.concat(neighbor)]);
          }
      }
  }
  return [];
}

const GameOver = ({opened, close, path, guesses, matchup,
                 resets, web, is_custom, matchupID}: GameOverProps) => {
  const [start, end] = matchup
  const [minPathOpened, { toggle: toggleMinPath }] = useDisclosure(false);

  const headerSwipeHandlers = useSwipeable({
      onSwipedDown: close
  })
  const drawerSwipeHandlers = useSwipeable({
      onSwipedDown: () => {
          if (entry?.isIntersecting) {
              close()
          }
      }
  })
  // Allow swipe down to close drawer from top of drawer
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 0,
  });

  const minPath = getMinPath(web, start, end)
  const minPathLength = minPath.length
  minPath.unshift(start)

  const [avgGuesses, setAvgGuesses] = useState<number | null>(null)
  const [avgResets, setAvgResets] = useState<number | null>(null)

  useEffect(() => {
    getAverageScore(matchupID).then((res) => {
      if (res !== null) {
        const [avgGuesses, avgResets] = res
        setAvgGuesses(Math.round(avgGuesses))
      }
    })
  }, [])

  return (
    <Drawer.Root opened={opened} onClose={close} size='85%'
    style={{borderRadius: '20px'}} padding='sm' position={'bottom'} scrollAreaComponent={undefined}>
      <Drawer.Overlay/>
      <Drawer.Content>
        <Drawer.Header {...headerSwipeHandlers} style={{top: -1}} onClick={close}>
          <Drawer.Title style={{width: '100%'}}>
              <Text ta='center' c='gray.1' size='xl' fw={700}>You Win!</Text>
          </Drawer.Title>
            <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
          <Flex 
            align="center"
            direction="column"
            gap="lg">
          <Matchup start={web[start]} end={web[end]} small={window.innerWidth > phoneMaxWidth ? false : true} />
          <Scoreboard guesses={guesses} resets={resets} greenBorder={true} small={window.innerWidth > phoneMaxWidth ? false : true}/>
          <Text ta="center" size="sm">Your Path</Text>
          <ScrollablePath matchup={matchup} web={web} path={path}></ScrollablePath>
          <Group justify="center">
            <SharePath path={path}/>
            <ShareResults path={path} guesses={guesses} matchup={matchup}
            matchupID={matchupID} resets={resets} is_custom={is_custom}/>
          </Group>
          <Group align='center' justify='center' gap="sm">
            <Text c="gray.1" size="sm" ta="center">
            The shortest path was {minPathLength} guesses.{guesses === minPathLength ? <b> Congrats!</b> : ""}
            </Text>
            {guesses !== minPathLength && <Button leftSection={minPathOpened ? <IconArrowUp size={15}/> : <IconArrowDown size={15}/>}
            color="gray.9" size="xs" styles={{ section: {marginRight: "4px"}}} onClick={toggleMinPath}>
                {minPathOpened ? "HIDE" : "VIEW"}
            </Button>}
          </Group>
          <Collapse in={minPathOpened}>
            <ScrollablePath matchup={matchup} web={web} path={minPath}></ScrollablePath>
          </Collapse>
          {!is_custom && <CountdownClock/>}
          <Text>{avgGuesses ?? ""}</Text>
          <Text>{avgResets ?? ""}</Text>
          </Flex>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
}

export default GameOver