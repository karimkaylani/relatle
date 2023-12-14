'use client'

import React, { useEffect, useState } from 'react'
import { Modal, Text, Flex, Group, Card, Collapse, Button, Stack } from '@mantine/core'
import ShareResults from './ShareResults'
import { Artist } from './Game'
import ScrollablePath from './ScrollablePath'
import ArtistInfo from './ArtistInfo'
import Scoreboard from './Scoreboard'
import SharePath from './SharePath'
import Arrow from './Arrow'
import * as Collections from 'typescript-collections';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'

export interface GameOverProps {
    opened: boolean,
    close: () => void,
    path: string[],
    guesses: number,
    matchup: string[],
    resets: number,
    web: {[key: string]: Artist},
    is_custom: boolean
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

const GameOver = (props: GameOverProps) => {
    const {opened, close, path, guesses, matchup, resets, web, is_custom} = props
    const [start, end] = matchup
    const [minPathOpened, { toggle: toggleMinPath }] = useDisclosure(false);

    const calculateTimeLeft = (): { hrs: string; mins: string; secs: string } => {
      const now = new Date()
      const tmrw = new Date(now)
      tmrw.setDate(now.getDate() + 1)
      tmrw.setHours(0,0,0,0)

      const addLeadingZero = (number: number): string => {
        return number < 10 ? `0${number}` : `${number}`;
      }
      
      const timeDiff = tmrw.getTime() - now.getTime();
      const hrs = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      return { hrs: addLeadingZero(hrs), mins: addLeadingZero(mins), secs: addLeadingZero(secs) };
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
    }, []);

    const minPath = getMinPath(web, start, end)
    const minPathLength = minPath.length
    minPath.unshift(start)

  
  return (
    <Modal opened={opened} 
    onClose={close} withCloseButton={true} centered
    padding="lg" radius="lg"
    title="You Won!"
    styles={{ title: { fontSize: "24px", color: "#f1f3f5", fontWeight: 700 } }}>
      <Flex 
          align="center"
          direction="column"
          gap="lg">
        <Group justify="center">
          <ArtistInfo artist={web[start]} small={true}></ArtistInfo>
          <Arrow small={false}/>
          <ArtistInfo artist={web[end]} small={true} is_green={true}></ArtistInfo>
        </Group>
        <Scoreboard guesses={guesses} resets={resets} greenBorder={true} small={true}/>
        <Text ta="center" size="sm">Your Path</Text>
        <ScrollablePath matchup={matchup} web={web} path={path}></ScrollablePath>
        <Group justify="center">
          <SharePath path={path}/>
          <ShareResults path={path} guesses={guesses} matchup={matchup} resets={resets} is_custom={is_custom}/>
        </Group>
        <Stack align='center' gap="7px">
          <Text fw={600} c="gray.1" size="sm" ta="center">
          The shortest possible path was {minPathLength} guesses{guesses === minPathLength ? ". Congrats!" : ""}
          </Text>
          <Button leftSection={minPathOpened ? <IconArrowUp size={15}/> : <IconArrowDown size={15}/>}
          color="gray.7" size="xs" styles={{ section: {marginRight: "4px"}}} onClick={toggleMinPath}>
              SHORTEST PATH
          </Button>
        </Stack>
        <Collapse in={minPathOpened}>
          <ScrollablePath matchup={matchup} web={web} path={minPath}></ScrollablePath>
        </Collapse>
        {!is_custom &&
          <Card shadow="md" radius="lg" p="sm" withBorder>
            <Flex
              gap="0px" justify="center"
              align="center" direction="column" wrap="wrap">
              <Text size="xs" ta="center" fw={500}>Time until next matchup</Text>
              <Text c="gray.1" size="md" fw={700}>{`${timeLeft.hrs}:${timeLeft.mins}:${timeLeft.secs}`}</Text>
            </Flex>
          </Card>
        }
      </Flex>
    </Modal>
  )
}

export default GameOver