import { Text, Modal, Stack, Autocomplete } from '@mantine/core'
import React, { useState } from 'react'
import { Artist } from './Game'
import Arrow from './Arrow'
import * as Collections from 'typescript-collections';
import ShareCustomGame from './ShareCustomGame'

interface CustomGameModalProps {
    web: {[key: string]: Artist},
    customModalOpened: boolean,
    customModalHandlers: any
}

function getValidPaths(graph: {[key: string]: Artist}, start: string, end: string, maxSteps: number): string[][] {
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
            for (const neighbor of graph[node].related || []) {
                queue.enqueue([neighbor, steps + 1, path.concat(neighbor)]);
            }
        }
    }
    return paths;
}
const getConnectedNodesMax = (graph: {[key: string]: Artist}, start: string, maxSteps: number): string[] => {
    const visited: Set<string> = new Set();
    const result: string[] = [];

    const dfs = (node: string, steps: number) => {
        if (steps > maxSteps) {
            return;
        }
        if (!visited.has(node)) {
            visited.add(node);
            if (node !== start) {result.push(node); }
            for (const neighbor of graph[node].related || []) {
                dfs(neighbor, steps + 1);
            }
        }
    }
    dfs(start, 0)
    return result
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

const maxDegsofSeperation = 1000000
const maxDegsAwayForWarning = 25

const CustomGameModal = (props: CustomGameModalProps) => {
    const {web, customModalOpened, customModalHandlers} = props
    const {open: customModalOpen, close: customModalClose} = customModalHandlers
    const artistsList: string[] = [...Object.keys(web)];
    const [matchupsFound, setMatchupsFound] = useState<string[]>([])
    const [startArtist, setStartArtist] = useState<string>("")
    const [endArtist, setEndArtist] = useState<string>("")
    const [key, setKey] = useState<number>(0)

    const selectStartArtist = (start: string) => {
        if (!artistsList.includes(start)) { return }
        const validEndArtsits = getConnectedNodes(web, start)
        setMatchupsFound(validEndArtsits)
        setStartArtist(start)
        setKey(key + 1)
    }
    
    const closeModal = () => {
        customModalClose()
        setStartArtist("")
        setEndArtist("")
        setMatchupsFound([])
    }
   
  return (
    <Modal opened={customModalOpened} 
    onClose={closeModal} withCloseButton={true} centered
    padding="xl" radius="lg"
    title="Create a Custom Game"
    styles={{ title: { fontSize: "24px", color: "#f1f3f5", fontWeight: 700 } }}>
        <Stack justify='center'>
            <Text>Create your custom matchup and send the link to challenge you and your friends.</Text>
            <Autocomplete size="md" radius="md" placeholder="Starting artist" data={artistsList}
            onOptionSubmit={selectStartArtist} onDropdownClose={() => selectStartArtist(startArtist)} onChange={setStartArtist} selectFirstOptionOnChange={true}/>
            <Arrow small={false} down={true}/>
            <Stack gap="xs">
                <Autocomplete key={key} size="md" radius="md" placeholder="Target artist" disabled={matchupsFound.length == 0}
                data={matchupsFound} onChange={setEndArtist} selectFirstOptionOnChange={true}/>
                <Text pl="5" ta="left" size="xs">If you don’t see your desired target artist, then the path from your starting artist is impossible within 25 guesses.</Text>
            </Stack>
            <ShareCustomGame start={startArtist} end={endArtist} 
            disabled={!(startArtist !== "" && endArtist !== "" && artistsList.includes(startArtist)
            && matchupsFound.includes(endArtist))}/> 
        </Stack>
    </Modal>
  )
}

export default CustomGameModal