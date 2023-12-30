import { Text, Modal, Stack, Autocomplete, Alert, Card, Group, Button, Image } from '@mantine/core'
import React, { useState } from 'react'
import { Artist } from './Game'
import Arrow from './Arrow'
import * as Collections from 'typescript-collections';
import ShareCustomGame, { generateCustomGameURL } from './ShareCustomGame'
import { IconInfoCircle, IconArrowsShuffle, IconPlayerPlayFilled } from '@tabler/icons-react';
import HoverButton from './HoverButton';
import ArtistInfo from './ArtistInfo';

interface CustomGameModalProps {
    web: {[key: string]: Artist},
    customModalOpened: boolean,
    customModalHandlers: any
}

/* From a starting artist, return a hashmap where the keys are endArtists
 and the values are the paths from the starting artist to the end artist */
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

const minDegOfSepRecommended = 3
const maxDegOfSepRecommended = 7
const maxDegOfSepWarning = 10
const maxNumPathsForWarning = 4
const minNumPathsForRecommended = 7
const maxNumPathsForRecommended = 25

const CustomGameModal = (props: CustomGameModalProps) => {
    const {web, customModalOpened, customModalHandlers} = props
    const {close: customModalClose} = customModalHandlers
    const artistsList: string[] = [...Object.keys(web)];
    const [matchupsFound, setMatchupsFound] = useState<string[]>([])
    const [startArtist, setStartArtist] = useState<string>("")
    const [endArtist, setEndArtist] = useState<string>("")
    const [recommendedEndArtists, setRecommendedEndArtists] = useState<string[]>([])

    const changeStartArtist = (start: string) => {
        setStartArtist(start)
        if (artistsList.includes(start)) {
             selectStartArtist(start) 
        }
        if (!artistsList.includes(endArtist)) {
            setEndArtist("")
        }
    }

    const noRepeatingArtistInAllPaths = (paths: string[][]): boolean => {
        let all_artists_in_paths = new Set(paths.flat())
        all_artists_in_paths.forEach((artist) => {
            if (paths.every((path) => path.slice(0, -1).includes(artist))) {
                return false
            }
        })
        return true
    }

    const getRecommendedArtists = (start: string) => {
        const closeEndArtists = Object.keys(getNumPathsEndArtists(web, start, minDegOfSepRecommended))
        const endArtistsWithMinDegOfSep = getNumPathsEndArtists(web, start, maxDegOfSepRecommended)
        const recommendedEndArtists = Object.keys(endArtistsWithMinDegOfSep).filter((artist) => {
            return endArtistsWithMinDegOfSep[artist].length >= minNumPathsForRecommended &&
            endArtistsWithMinDegOfSep[artist].length <= maxNumPathsForRecommended &&
            !closeEndArtists.includes(artist) &&
            // there isn't any single artist that appears in all paths
            noRepeatingArtistInAllPaths(endArtistsWithMinDegOfSep[artist])
        })
        return recommendedEndArtists
    }

    const selectStartArtist = (start: string) => {
        if (!artistsList.includes(start)) { return }
        const endArtists = getConnectedNodes(web, start)
        setMatchupsFound(endArtists)
        const recommendedEndArtists = getRecommendedArtists(start)
        setRecommendedEndArtists(recommendedEndArtists)
        setStartArtist(start)
        if (!endArtists.includes(endArtist) || !artistsList.includes(endArtist)) {
            setEndArtist("")
        }
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
        selectStartArtist(start)
        setEndArtist(end)
    }

    const getRandomRecommendedMatchup = () => {
        let found = false
        while (!found) {
            const start = artistsList[Math.floor(Math.random() * artistsList.length)]
            const recommendedEndArtists = getRecommendedArtists(start)
            if (recommendedEndArtists.length > 0) {
                const end = recommendedEndArtists[Math.floor(Math.random() * recommendedEndArtists.length)]
                selectStartArtist(start)
                setEndArtist(end)
                found = true
            }
        }
    }

    const isMatchupDifficult = () => {
        return artistsList.includes(startArtist) && matchupsFound.includes(endArtist) && 
        getValidPaths(web, startArtist, endArtist, maxDegOfSepWarning).length < maxNumPathsForWarning &&
        getValidPaths(web, startArtist, endArtist, minDegOfSepRecommended).length <= 0
    }
   
  return (
    <Modal opened={customModalOpened} 
        onClose={closeModal} withCloseButton={true} centered
        padding="xl" radius="lg"
        title="Create a Custom Game"
        styles={{ title: { fontSize: "20px", color: "#f1f3f5", fontWeight: 700, lineHeight: "32px" } }}>
        <Stack>
            <Text>Play your own custom matchup and send the link to challenge your friends.</Text>
            <Autocomplete size='lg' radius="md" placeholder="Starting artist" data={artistsList}
                onChange={changeStartArtist} selectFirstOptionOnChange={true}
                styles={{input: {color: "#f1f3f5"}, dropdown: {color: "#f1f3f5"}}} value={startArtist}
                leftSection={web[startArtist] !== undefined && 
                <ArtistInfo artist={web[startArtist]} small={true} show_name={false}/>}/>
            <Arrow small={false} down={true}/>
            <Stack gap="xs">
                <Autocomplete size="lg" radius="md" placeholder="Target artist" disabled={!artistsList.includes(startArtist) || matchupsFound.length == 0}
                    data={[
                        {group: 'Recommended Target Artists', items: recommendedEndArtists},
                        {group: 'Target Artists', items: matchupsFound.filter((artist)=> !recommendedEndArtists.includes(artist))}]}
                    styles={{input: {color: "#f1f3f5", outline: isMatchupDifficult() ? '2px solid #fcc419' : ''}, 
                    groupLabel: {color: "#37b24d", fontWeight: 700}, dropdown: {color: "#f1f3f5"}}}
                    onChange={setEndArtist} selectFirstOptionOnChange={true} value={endArtist}
                    leftSection={web[endArtist] !== undefined && matchupsFound.includes(endArtist) &&
                        <ArtistInfo artist={web[endArtist]} small={true} is_green={true} show_name={false}/>}/>

                {isMatchupDifficult() ? 
                    <Text pl="5" pb='14' ta="left" fw={700} c='yellow.3' size="md">This matchup may be difficult!</Text>
                    :
                    <Text pl="5" ta="left" fw={700} size="sm">If you don&apos;t see your desired target artist, the matchup is impossible.</Text>
                }
            </Stack>
            <Group align='center' justify='center'>
                <HoverButton onTap={getRandomRecommendedMatchup}>
                    <Card shadow="md" radius="lg"
                    p="sm">
                        <Group gap="6px" justify='center'>
                            <Image src={"custom-icon.svg"}/>
                            <Text size="sm" fw={700} c="gray.1">RECOMMENDED</Text>
                        </Group>
                    </Card>
                </HoverButton>

                <HoverButton onTap={getRandomMatchup}>
                    <Card shadow="md" radius="lg"
                    p="sm">
                        <Group gap="4px" justify='center'>
                            <IconArrowsShuffle size={16}/>
                            <Text size="sm" fw={700} c="gray.1">RANDOM</Text>
                        </Group>
                    </Card>
                </HoverButton>
            </Group>

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