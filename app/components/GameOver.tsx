'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Modal, Text, Flex, Group, Collapse, Button, Drawer, Affix, Card, Transition, Space, Stack, Divider, ScrollArea } from '@mantine/core'
import ShareResults from './ShareResults'
import { Artist, phoneMaxWidth } from './Game'
import ScrollablePath from './ScrollablePath'
import Scoreboard, { ScoreDisplay } from './Scoreboard'
import SharePath from './SharePath'
import * as Collections from 'typescript-collections';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react'
import { useDisclosure, useIntersection } from '@mantine/hooks'
import Matchup from './Matchup'
import { useSwipeable } from 'react-swipeable'
import CountdownClock from './CountdownClock'
import GlobalScoreSlider from './GlobalScoreSlider'
import { getAverageMinGuesses } from '../db'

export interface GameOverProps {
    opened: boolean,
    close: () => void,
    path: string[],
    guesses: number,
    matchup: string[],
    resets: number,
    web: {[key: string]: Artist},
    is_custom: boolean,
    matchupID: number,
    streak: number,
    longest_streak: number,
    days_played: number
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
                resets, web, is_custom, matchupID, streak,
                longest_streak, days_played}: GameOverProps) => {
  const [start, end] = matchup
  const [minPathOpened, { toggle: toggleMinPath }] = useDisclosure(false);

  const headerSwipeHandlers = useSwipeable({
      onSwipedDown: close
  })

  const minPath = getMinPath(web, start, end)
  const minPathLength = minPath.length
  minPath.unshift(start)

  const [avgGuesses, setAvgGuesses] = useState<number>(-1)
  const [minGuesses, setMinGuesses] = useState<number>(-1)

  useEffect(() => {
    if (!opened) {
      return
    }
    getAverageMinGuesses(matchupID).then((res) => {
      if (res !== null) {
        const [avgGuesses, minGuesses] = res
        const roundedAvgGuesses = Math.round(avgGuesses)
        setAvgGuesses(roundedAvgGuesses !== 0 ? roundedAvgGuesses : -1)
        setMinGuesses(minGuesses !== 0 ? minGuesses : -1)
      }
    })
  }, [opened])

  const [height, setHeight] = useState(77)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeight(ref.current?.clientHeight ?? 77)
  })

  return (
    <Drawer.Root opened={opened} onClose={close} size='85%'
    style={{borderRadius: '20px'}} padding='sm' position={'bottom'}>
      <Drawer.Overlay/>
      <Drawer.Content>
        <Drawer.Header {...headerSwipeHandlers} style={{top: -1}} onClick={close}>
          <Drawer.Title style={{width: '100%'}}>
              <Text ta='center' c='gray.1' size='xl' fw={700}>You Won!</Text>
          </Drawer.Title>
            <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
          <Flex 
            align="center"
            direction="column"
            gap="lg" styles={{root: {marginBottom: height}}}>
          <Matchup start={web[start]} end={web[end]} small={window.innerWidth > phoneMaxWidth ? false : true} />
          <Scoreboard guesses={guesses} resets={resets} greenBorder={false} small={window.innerWidth > phoneMaxWidth ? false : true}/>
          <Text ta="center" fw={700} size="sm">Your Path</Text>
          <ScrollablePath matchup={matchup} web={web} path={path}/>

          <Group align='center' justify='center' gap="sm">
            <Text fw={700} size="sm" ta="center">
            {guesses === minPathLength ? `Congrats! The shortest path was ${minPathLength} guesses long`: `Shortest Path: ${minPathLength}`}
            </Text>
            {guesses !== minPathLength && <Button leftSection={minPathOpened ? <IconArrowUp size={15}/> : <IconArrowDown size={15}/>}
            color="gray.9" size="xs" styles={{ section: {marginRight: "4px"}}} onClick={toggleMinPath}>
                {minPathOpened ? "HIDE" : "VIEW"}
            </Button>}
          </Group>
          <Collapse in={minPathOpened}>
            <ScrollablePath matchup={matchup} web={web} path={minPath}></ScrollablePath>
          </Collapse>
          {(!is_custom && avgGuesses !== -1) && <GlobalScoreSlider guesses={guesses} avgGuesses={avgGuesses ?? -1} minGuesses={minGuesses ?? -1}/>}
          {!is_custom && <Fragment>
            <Text ta="center" fw={700} size="sm">Your Stats</Text>
            <Card shadow="lg" radius="lg" p="xs">
                <Group align='center' justify="center">
                    {ScoreDisplay("Streak", streak.toString(), true)}
                    <Divider orientation="vertical" />
                    {ScoreDisplay("Longest Streak", longest_streak.toString(), true)}
                    <Divider orientation="vertical" />
                    {ScoreDisplay("Days Played", days_played.toString(), true)}
                </Group>
            </Card>
          </Fragment>}
          {!is_custom && <CountdownClock/>}
          <Affix w="100%" position={{bottom: 0}}>
          <Transition transition="slide-up" mounted={opened} timingFunction='ease'>
          {(transitionStyles) => (
            <Card ref={ref} p="lg" bg='#1a1b1e' radius='0px' style={transitionStyles} withBorder
            styles={{root: {borderLeft: '0px', borderBottom: '0px', borderRight: '0px'}}}>
              <Group justify="center" align='center'>
                <SharePath path={path}/>
                <ShareResults path={path} guesses={guesses} matchup={matchup}
                matchupID={matchupID} resets={resets} is_custom={is_custom}/>
              </Group>
            </Card>
          )}
          </Transition>
          </Affix>
          </Flex>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
}

export default GameOver