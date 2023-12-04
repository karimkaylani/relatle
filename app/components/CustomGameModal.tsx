import { Text, Modal, Stack, Autocomplete, Alert, Card, Group } from '@mantine/core'
import React, { useState } from 'react'
import { Artist } from './Game'
import Arrow from './Arrow'
import * as Collections from 'typescript-collections';
import ShareCustomGame from './ShareCustomGame'
import { IconInfoCircle, IconArrowsShuffle } from '@tabler/icons-react';
import HoverButton from './HoverButton';

interface CustomGameModalProps {
    web: {[key: string]: Artist},
    customModalOpened: boolean,
    customModalHandlers: any
}

function getValidPaths(web: {[key: string]: Artist}, start: string, end: string, maxSteps: number): string[][] {
    const visited: Set<string> = new Set();
    const queue: Collections.Queue<[string, number, string[]]> = new Collections.Queue();
    queue.enqueue([start, 0, []]);
    const paths: string[][] = [];

    while (!queue.isEmpty()) {
        const item = queue.dequeue();
        if (item === undefined) {
            return paths;
        }
        const [node, steps, path] = item
        if (node === end && steps <= maxSteps) {
            paths.push(path);
        }
        if (!visited.has(node) && steps <= maxSteps) {
            visited.add(node);
            for (const neighbor of web[node].related || []) {
                queue.enqueue([neighbor, steps + 1, path.concat(neighbor)]);
            }
        }
    }
    return paths;
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
const getConnectedNodes = (graph: {[key: string]: Artist}, start: string): string[] => {
    const visited: Set<string> = new Set();
    const result: string[] = [];

    const dfs = (node: string) => {
        if (!visited.has(node)) {
            visited.add(node);
            if (node !== start) {result.push(node); }
            for (const neighbor of graph[node].related || []) {
                dfs(neighbor);
            }
        }
    }
    dfs(start)
    return result
}

const maxDegsAwayForWarning = 10

const CustomGameModal = (props: CustomGameModalProps) => {
    const {web, customModalOpened, customModalHandlers} = props
    const {close: customModalClose} = customModalHandlers
    const artistsList: string[] = [...Object.keys(web)];
    const [matchupsFound, setMatchupsFound] = useState<string[]>([])
    const [startArtist, setStartArtist] = useState<string>("")
    const [endArtist, setEndArtist] = useState<string>("")

    const changeStartArtist = (start: string) => {
        setStartArtist(start)
        setEndArtist("")
    }

    const selectStartArtist = (start: string) => {
        if (!artistsList.includes(start)) { return }
        const validEndArtsits = getConnectedNodes(web, start)
        setMatchupsFound(validEndArtsits)
        setStartArtist(start)
        setEndArtist("")
    }
    
    const closeModal = () => {
        customModalClose()
        setStartArtist("")
        setEndArtist("")
        setMatchupsFound([])
    }

    const getRandomMatchup = () => {
        const start = artistsList[Math.floor(Math.random() * artistsList.length)]
        const validEndArtsits = getConnectedNodes(web, start)
        const end = validEndArtsits[Math.floor(Math.random() * validEndArtsits.length)]
        setStartArtist(start)
        setEndArtist(end)
        setMatchupsFound(validEndArtsits)
    }
   
  return (
    <Modal opened={customModalOpened} 
    onClose={closeModal} withCloseButton={true} centered
    padding="xl" radius="lg" lockScroll={false}
    title="Create a Custom Game"
    styles={{ title: { fontSize: "24px", color: "#f1f3f5", fontWeight: 700 } }}>
        <Stack>
            <Text>Create your custom matchup and send the link to challenge you and your friends.</Text>
            <Autocomplete size="md" radius="md" placeholder="Starting artist" data={artistsList}
            onOptionSubmit={selectStartArtist} onDropdownClose={() => selectStartArtist(startArtist)} onChange={changeStartArtist} selectFirstOptionOnChange={true}
            value={startArtist}/>
            <Arrow small={false} down={true}/>
            <Stack gap="xs">
                <Autocomplete size="md" radius="md" placeholder="Target artist" disabled={!artistsList.includes(startArtist) || matchupsFound.length == 0}
                data={matchupsFound} onChange={setEndArtist} selectFirstOptionOnChange={true} value={endArtist}/>
                <Text pl="5" ta="left" size="xs">If you don&apos;t see your desired target artist, then the path from your starting artist is impossible.</Text>
            </Stack>

            <HoverButton onTap={() => getRandomMatchup()}>
                <Card shadow="md" radius="lg"
                p="xs">
                    <Group gap="4px" justify='center'>
                        <IconArrowsShuffle size={16}/>
                        <Text size="sm" c="gray.1">RANDOM</Text>
                    </Group>
                </Card>
            </HoverButton>

            {artistsList.includes(startArtist) && matchupsFound.includes(endArtist) && getMinPath(web, startArtist, endArtist).length > maxDegsAwayForWarning && 
            <Alert variant="light" color="yellow" radius="md" title="This matchup may be very difficult" icon={<IconInfoCircle />}
            styles={{ title: {paddingTop: "1.5px"}}}/>
            }

            <ShareCustomGame start={startArtist} end={endArtist} 
            disabled={!(artistsList.includes(startArtist) && matchupsFound.includes(endArtist))}/> 
        </Stack>
    </Modal>
  )
}

export default CustomGameModal