import { Text, Modal, Stack, Autocomplete, Alert, Card, Group, Button, Anchor } from '@mantine/core'
import React, { useState } from 'react'
import { Artist } from './Game'
import Arrow from './Arrow'
import * as Collections from 'typescript-collections';
import ShareCustomGame, { generateCustomGameURL } from './ShareCustomGame'
import { IconInfoCircle, IconArrowsShuffle, IconPlayerPlayFilled } from '@tabler/icons-react';
import HoverButton from './HoverButton';

interface CustomGameModalProps {
    web: {[key: string]: Artist},
    customModalOpened: boolean,
    customModalHandlers: any
}


const getNumPathsEndArtists = (web: {[key: string]: Artist}, start: string, maxSteps: number=Infinity): {[key: string]: string[][]} => {
    const visited: Set<string> = new Set();
    const queue: Collections.Queue<[string, string[]]> = new Collections.Queue();
    queue.enqueue([start, []]);
    const endArtists: {[key: string]: string[][]} = {};

    while (!queue.isEmpty()) {
        const item = queue.dequeue();
        if (item === undefined) {
            return endArtists;
        }
        const [node, path] = item
        if (path.length <= maxSteps) {
            if (node !== start) {
                if (endArtists[node] === undefined) {
                    endArtists[node] = [path]
                } else {
                    endArtists[node].push(path)
                }
            }
            if (!visited.has(node)) {
                visited.add(node);
                for (const neighbor of web[node].related || []) {
                    queue.enqueue([neighbor, [...path, neighbor]]);
                }
            }
        }
    }
    return endArtists
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

const minDegOfSepReccomended = 3
const maxDegOfSepReccomended = 10
const maxDegOfSepWarning = 10
const maxNumPathsForWarning = 4
const minNumPathsForReccomended = 7
const maxNumPathsForReccomended = 25

const CustomGameModal = (props: CustomGameModalProps) => {
    const {web, customModalOpened, customModalHandlers} = props
    const {close: customModalClose} = customModalHandlers
    const artistsList: string[] = [...Object.keys(web)];
    const [matchupsFound, setMatchupsFound] = useState<string[]>([])
    const [startArtist, setStartArtist] = useState<string>("")
    const [endArtist, setEndArtist] = useState<string>("")
    const [reccomendedEndArtists, setReccomendedEndArtists] = useState<string[]>([])

    const changeStartArtist = (start: string) => {
        setStartArtist(start)
        setEndArtist("")
    }    

    const selectStartArtist = (start: string) => {
        if (!artistsList.includes(start)) { return }
        const endArtists = getConnectedNodes(web, start)
        setMatchupsFound(endArtists)
        const closeEndArtists = Object.keys(getNumPathsEndArtists(web, start, minDegOfSepReccomended))
        const endArtistsWithMinDegOfSep = getNumPathsEndArtists(web, start, maxDegOfSepReccomended)
        const reccomendedEndArtists = Object.keys(endArtistsWithMinDegOfSep).filter((artist) => {
            return endArtistsWithMinDegOfSep[artist].length >= minNumPathsForReccomended &&
            endArtistsWithMinDegOfSep[artist].length <= maxNumPathsForReccomended &&
            !closeEndArtists.includes(artist) &&
            // paths don't all start with the same artist
            new Set(endArtistsWithMinDegOfSep[artist].map((path) => path[0])).size > 1
        })
        setReccomendedEndArtists(reccomendedEndArtists)
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
        styles={{ title: { fontSize: "24px", color: "#f1f3f5", fontWeight: 700, lineHeight: "32px" } }}>
        <Stack>
            <Text>Create your custom matchup and send the link to challenge you and your friends.</Text>
            <Autocomplete size="md" radius="md" placeholder="Starting artist" data={artistsList}
                onOptionSubmit={selectStartArtist} onDropdownClose={() => selectStartArtist(startArtist)} onChange={changeStartArtist} selectFirstOptionOnChange={true}
                styles={{input: {color: "#f1f3f5"}}} value={startArtist}/>
            <Arrow small={false} down={true}/>
            <Stack gap="xs">
                <Autocomplete size="md" radius="md" placeholder="Target artist" disabled={!artistsList.includes(startArtist) || matchupsFound.length == 0}
                    data={[
                        {group: 'Recommended End Artists', items: reccomendedEndArtists},
                        {group: 'End Artists', items: matchupsFound.filter((artist)=> !reccomendedEndArtists.includes(artist))}]}
                    styles={{input: {color: "#f1f3f5"}, groupLabel: {color: "#51cf66"}}} onChange={setEndArtist} selectFirstOptionOnChange={true} value={endArtist}/>
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

            {artistsList.includes(startArtist) && matchupsFound.includes(endArtist) && getValidPaths(web, startArtist, endArtist, maxDegOfSepWarning).length < maxNumPathsForWarning && 
            <Alert variant="light" color="yellow" radius="md" title="This matchup may be difficult" icon={<IconInfoCircle />}
            styles={{ title: {paddingTop: "1.5px"}}}/>}

            <Button leftSection={<IconPlayerPlayFilled size={20}/>}
            onClick={() => window.open(generateCustomGameURL(startArtist, endArtist))}
            disabled={!(artistsList.includes(startArtist) && matchupsFound.includes(endArtist))}
            color="green.6" styles={{ section: {marginRight: "4px"}}}>
                START CUSTOM GAME
            </Button>

            <ShareCustomGame start={startArtist} end={endArtist} 
            disabled={!(artistsList.includes(startArtist) && matchupsFound.includes(endArtist))}/> 
        </Stack>
    </Modal>
  )
}

export default CustomGameModal