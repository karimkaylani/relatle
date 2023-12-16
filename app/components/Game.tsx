'use client'

import React, { Fragment, createContext, useEffect, useRef, useState } from 'react'
import ArtistCard from './ArtistCard'
import GameOver from './GameOver'
import Reset from './Reset'
import { Flex, SimpleGrid, Text, Image, Anchor, Stack, Group, Card, Space, Modal } from '@mantine/core'
import { useDisclosure, useScrollIntoView } from '@mantine/hooks'
import Matchup from './Matchup'
import Scoreboard from './Scoreboard'
import RelatedArtistsTitle from './RelatedArtistsTitle'
import HowToPlay from './HowToPlay'
import HoverButton from './HoverButton'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import CustomGameButton from './CustomGameButton'
import CustomGameModal from './CustomGameModal'

export interface Artist {
    name: string,
    id: string,
    image: string,
    related: string[]
}

interface GameProps {
    web: {[key: string]: Artist},
    matchups: {[key: string]: string[]}|null,
    is_custom: boolean
}

interface SaveProps {
    currArtist: Artist,
    path: string[],
    won: boolean,
    guesses: number,
    resets: number,
    matchup: string[]
}

export const phoneMaxWidth = 768;

const getTodaysMatchup = (matchups: {[key: string]: string[]}|null): any => {
    if (matchups == null) { return }
    const defaultDate = "11/29/2023"
    const today = new Date()
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    return matchups[formattedDate] ?? matchups[defaultDate]
}

const Game = (props: GameProps) => {
    const {web, matchups, is_custom} = props
    const [matchup, setMatchup] = useState<any>(null)
    const [currArtist, setCurrArtist] = useState<any>(null)
    const [path, setPath] = useState<any>(null)
    const [won, setWon] = useState<boolean>(false)
    const [guesses, setGuesses] = useState<number>(0)
    const [resets, setResets] = useState<number>(0)

    const [winModalOpened, winModalHandlers] = useDisclosure(false)
    const {open: winModalOpen, close: winModalClose} = winModalHandlers

    const [htpModalOpened, htpModalHandlers] = useDisclosure(false);
    const {open: htpModalOpen} = htpModalHandlers

    const [customModalOpened, customModalHandlers] = useDisclosure(false);
    const {open: customModalOpen} = customModalHandlers

    const searchParams = useSearchParams()
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
        duration: 500,
        offset: -10
    });
    
    const save = (saveData: SaveProps): void => { 
        localStorage.setItem(is_custom ? "props_custom" : "props", JSON.stringify(saveData));
    }

    const readLocalStroage = (): SaveProps|null => {
        // Ensure page is mounted to client before trying to read localStorage
        const item = localStorage.getItem(is_custom ? "props_custom" : "props");
        if (item === null) {
            return null
        }
        const saveData = JSON.parse(item) as SaveProps;
        return saveData
    }

    const loadLocalStorageIntoState = (todayMatchup: string[]):void => {
        const localSave = readLocalStroage();
        if (localSave == null) {
            if (localStorage.getItem("props") == null && localStorage.getItem("props_custom") == null) {
                 htpModalOpen() 
            }
            return
        }
        if (JSON.stringify(localSave.matchup) !== JSON.stringify(todayMatchup)) {
            return
        }
        setCurrArtist(localSave.currArtist)
        setPath(localSave.path)
        setWon(localSave.won)
        setGuesses(localSave.guesses)
        setResets(localSave.resets)
        if (localSave.won) {
            winModalOpen()
        }
    }

    // When component first mounts, load in localStorage
    // use loading so that nothing renders until localStorage is checked
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        // Put in here to ensure we're getting client time,
        // as well as all other state variables that rely
        // on our matchup
        const start = searchParams.get("start")
        const end = searchParams.get("end")
        let custom_matchup = [start, end]
        let todayMatchup = is_custom ? custom_matchup : getTodaysMatchup(matchups)
        if (todayMatchup == null) { return }
        setMatchup(todayMatchup)
        setCurrArtist(web[todayMatchup[0]])
        setPath([todayMatchup[0]])
        loadLocalStorageIntoState(todayMatchup)
        setLoading(false)
    }, [])

    const [width, setWidth] = useState(0)
    const handleResize = () => setWidth(window.innerWidth)
    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (loading) {
        return null;
    }

    const [start, end] = matchup

    if (!(start in web) || !(end in web) || (start === end)) { 
        window.open("/", "_self")
        return
    }

    const scrollToTop = () => {
        scrollIntoView()
    }

    const updateArtistHandler = (artist: Artist): void => {
        if (won === true) {
            if (artist.name === end) { winModalOpen() }
            return
        }
        const newPath = [...path, artist.name]
        setPath(newPath)
        setGuesses(guesses + 1)
        if (artist.name === end) {
            setWon(true)
            save({
                currArtist, path: newPath, won:true,
                guesses: guesses+1, resets, matchup
            })
            winModalOpen()
            return
        }
        scrollToTop()
        setCurrArtist(artist)
        save({
            currArtist: artist, path: newPath, won,
            guesses: guesses+1, resets, matchup
        })
    }

    const resetHandler = (): void => {
        if (won === true || currArtist.name == start) {
            return
        }
        scrollToTop()
        const newPath = [...path, "RESET"]
        setPath(newPath)
        setResets(resets + 1)
        setCurrArtist(web[start])
        save({
            currArtist: web[start], path: newPath, won,
            guesses, resets: resets+1, matchup
        })
    }

    return (
        <Flex align="center" direction="column"
            gap="lg" className="mt-5 pb-10 pl-5 pr-5">
            <Group justify="space-between" align="center" wrap='nowrap'
                styles={{ root: {width: "100%"} }}>
                {/* 159.11 is the width of of the CustomGameButton so that the logo is centered */}
                {width > phoneMaxWidth && <Space w={159.11}/>}
                <Stack gap="0px">
                    <Link href="/"><Image w={width > phoneMaxWidth ? 250 : 175} src="logo.png" alt="logo"></Image></Link>
                    {is_custom && <Text p="0px" c="gray.1" ta="center">Custom Game</Text>}
                </Stack>
                <CustomGameButton customModalOpen={customModalOpen}/>
                <CustomGameModal customModalOpened={customModalOpened} customModalHandlers={customModalHandlers} web={web}/>
            </Group>
            <Stack gap="xs">
                <Text size={width > phoneMaxWidth ? "md" : "sm"} ta="center">Use related artists to get from</Text>
                <Matchup ref={targetRef} start={web[start]} end={web[end]} small={width <= phoneMaxWidth}/>
            </Stack>
            {won ? 
                <HoverButton onTap={winModalOpen}>
                    <Scoreboard guesses={guesses} resets={resets} greenBorder={won}/>
                </HoverButton>
                :
                <Scoreboard guesses={guesses} resets={resets} greenBorder={won}/>
            }
            <RelatedArtistsTitle artist={currArtist} won={won} endArtist={web[end]}/>
            <GameOver opened={winModalOpened} close={winModalClose} path={path} guesses={guesses} matchup={matchup} resets={resets} web={web} is_custom={is_custom}/>
            <SimpleGrid cols={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5 }}>
            {currArtist.related.map((artist_name: string) => 
                <ArtistCard key={web[artist_name].id} artist={web[artist_name]} path={path} won={won} end={end}
                updateArtistHandler={updateArtistHandler}/>)}
            </SimpleGrid>
            {!won && <Reset resetHandler={resetHandler}/>}
            <HowToPlay start={web[start]} end={web[end]} opened={htpModalOpened} handlers={htpModalHandlers}/>
            <Text>Built by <Anchor c="green.8" href="https://karimkaylani.com/" target="_blank">Karim Kaylani</Anchor>. 
            Designed by <Anchor c="green.8" href="https://zade.design/" target="_blank">Zade Kaylani</Anchor>.</Text>
        </Flex>
    )
}

export default Game