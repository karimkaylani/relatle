'use client'

import React, { Fragment, createContext, useEffect, useRef, useState } from 'react'
import ArtistCard from './ArtistCard'
import GameOver from './GameOver'
import Reset from './Reset'
import { Flex, SimpleGrid, Text, Image, Anchor, Stack, Group, Space, Popover } from '@mantine/core'
import { useDisclosure, useIntersection, useMergedRef, useScrollIntoView } from '@mantine/hooks'
import Matchup from './Matchup'
import Scoreboard from './Scoreboard'
import RelatedArtistsTitle from './RelatedArtistsTitle'
import HowToPlay from './HowToPlay'
import HoverButton from './HoverButton'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import CustomGameButton from './CustomGameButton'
import CustomGameModal from './CustomGameModal'
import AffixStatus from './AffixStatus'
import CoffeeButton from './CoffeeButton'
import { useAnimate } from 'framer-motion'
import Hint from './Hint'
import { addScoreToDB, getAverageScore } from '../page'

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
    matchup: string[],
    usedHint?: boolean,
    prevMatchupID?: number,
    numDaysPlayed?: number,
    streak?: number,
    longestStreak?: number,
    sumScores?: number,
    averageScore?: number,
    sumResets?: number,
    averageResets?: number
}

export const phoneMaxWidth = 768;

const Game = (props: GameProps) => {
    const {web, matchups, is_custom} = props
    const [matchup, setMatchup] = useState<any>(null)
    const [currArtist, setCurrArtist] = useState<any>(null)
    const [path, setPath] = useState<any>(null)
    const [won, setWon] = useState<boolean>(false)
    const [guesses, setGuesses] = useState<number>(0)
    const [resets, setResets] = useState<number>(0)

    const [prevMatchupID, setPrevMatchupID] = useState<number>(-1)
    const [numDaysPlayed, setNumDaysPlayed] = useState<number>(0)
    const [streak, setStreak] = useState<number>(0)
    const [longestStreak, setLongestStreak] = useState<number>(0)
    const [sumScores, setSumScores] = useState<number>(0)
    const [averageScore, setAverageScore] = useState<number>(0)
    const [sumResets, setSumResets] = useState<number>(0)
    const [averageResets, setAverageResets] = useState<number>(0)

    const [matchupID, setMatchupID] = useState<number>(-1)

    const [winModalOpened, winModalHandlers] = useDisclosure(false)
    const {open: winModalOpen, close: winModalClose} = winModalHandlers

    const [htpModalOpened, htpModalHandlers] = useDisclosure(false);
    const {open: htpModalOpen} = htpModalHandlers

    const [customModalOpened, customModalHandlers] = useDisclosure(false);
    const {open: customModalOpen} = customModalHandlers

    const [usedHint, setUsedHint] = useState<boolean>(false)

    const searchParams = useSearchParams()
    const { scrollIntoView, targetRef: scrollViewRef } = useScrollIntoView<HTMLDivElement>({
        duration: 500,
        offset: -10
    });
    const containerRef = useRef<HTMLDivElement>(null);
    const { ref: affixRef, entry: entryAffix } = useIntersection({
        root: containerRef.current,
        threshold: 0,
    });

    const matchupRef = useMergedRef(scrollViewRef, affixRef)

    const [scope, animate] = useAnimate()
    // To prevent user from clicking on multiple artists at once
    // or reseting while executing artist click animation
    const [artistClicked, setArtistClicked] = useState(false)
    
    const [endMissed, setEndMissed] = useState(false)
    
    const save = (saveData: SaveProps): void => {
        // if this is a save for a non-winning state, wanna make sure we 
        // don't lose streak data, avg score, etc. so we pull from state variables
        if (!is_custom && saveData.prevMatchupID === undefined) {
            saveData.prevMatchupID = prevMatchupID
            saveData.numDaysPlayed = numDaysPlayed
            saveData.streak = streak
            saveData.longestStreak = longestStreak
            saveData.sumScores = sumScores
            saveData.averageScore = averageScore
            saveData.sumResets = sumResets
            saveData.averageResets = averageResets
        }
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
        setPrevMatchupID(localSave.prevMatchupID ?? -1)
        setNumDaysPlayed(localSave.numDaysPlayed ?? 0)
        setStreak(localSave.streak ?? 0)
        setLongestStreak(localSave.longestStreak ?? 0)
        setSumScores(localSave.sumScores ?? 0)
        setAverageScore(localSave.averageScore ?? 0)

        if (JSON.stringify(localSave.matchup) !== JSON.stringify(todayMatchup)) {
            return
        }
        setCurrArtist(localSave.currArtist)
        setPath(localSave.path)
        setWon(localSave.won)
        setGuesses(localSave.guesses)
        setResets(localSave.resets)
        setUsedHint(localSave.usedHint ?? false)
        if (localSave.won) {
            winModalOpen()
        }
    }

    const getTodaysMatchup = (matchups: {[key: string]: string[]}|null): any => {
        if (matchups == null) { return }
        const defaultDate = "11/29/2023"
        const today = new Date()
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const year = today.getFullYear();
        const formattedDate = `${month}/${day}/${year}`;
        const matchup = matchups[formattedDate] ?? matchups[defaultDate]
        const matchupID = Object.keys(matchups).indexOf(formattedDate) + 1
        setMatchupID(matchupID)
        return matchup
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
        if (!entryAffix?.isIntersecting) {
            scrollIntoView()
        }
    }

    const updateArtistHandler = async (artist: Artist) => {
        setArtistClicked(false)
        if (won === true) {
            if (artist.name === end) { winModalOpen() }
            return
        }
        const newPath = [...path, artist.name]
        setPath(newPath)
        setGuesses(guesses + 1)
        if (artist.name === end) {
            setWon(true)
            
            let new_streak = 1
            if (prevMatchupID !== -1 && prevMatchupID === matchupID - 1) {
                new_streak = streak + 1
            }
            let new_longest_streak = new_streak > longestStreak ? new_streak : longestStreak
            setPrevMatchupID(matchupID)
            setNumDaysPlayed(numDaysPlayed + 1)
            setStreak(new_streak)
            setLongestStreak(new_longest_streak)

            const new_sum_scores = sumScores + guesses + 1
            setSumScores(new_sum_scores)
            const new_average_score = new_sum_scores / (numDaysPlayed + 1)
            setAverageScore(new_average_score)

            const new_sum_resets = sumResets + resets
            setSumResets(new_sum_resets)
            const new_average_resets = new_sum_resets / (numDaysPlayed + 1)
            setAverageResets(new_average_resets)
            save(is_custom ? 
                {
                    currArtist, path: newPath, won:true,
                    guesses: guesses+1, resets, matchup, usedHint
                } :
                {
                currArtist, path: newPath, won:true,
                guesses: guesses+1, resets, matchup, usedHint,
                prevMatchupID: matchupID, numDaysPlayed: numDaysPlayed+1,
                streak: new_streak, longestStreak: new_longest_streak,
                sumScores: new_sum_scores, averageScore: new_average_score,
                sumResets: new_sum_resets, averageResets: new_average_resets
            })
            winModalOpen()
            if (!is_custom) {
                await addScoreToDB(matchup, matchupID, guesses+1, resets, newPath, usedHint)
            }
            return
        }
        scrollToTop()
        const prevCurrArtist = currArtist
        if (prevCurrArtist.related.includes(end)) {
            missedArtistHandler()
        }
        setCurrArtist(artist)
        save({
            currArtist: artist, path: newPath, won,
            guesses: guesses+1, resets, matchup, usedHint
        })
    }

    const resetHandler = (): void => {
        if (won === true || currArtist.name == start) {
            return
        }
        if (currArtist.related.includes(end)) {
            missedArtistHandler()
        }
        scrollToTop()
        const newPath = [...path, "RESET"]
        setPath(newPath)
        setResets(resets + 1)
        setCurrArtist(web[start])
        save({
            currArtist: web[start], path: newPath, won,
            guesses, resets: resets+1, matchup, usedHint
        })
    }

    const useHintHandler = (): void => {
        if (usedHint) { return }
        setUsedHint(true)
        save({
            currArtist, path, won,
            guesses, resets, matchup, usedHint: true
        })
    }

    const missedArtistHandler = (): void => {
        setEndMissed(true)
        setTimeout(() => setEndMissed(false), 2000)
    }

    const clickArtistHandler = (artist: Artist) => {
        animate([[scope.current, { scale: 0.95 }, { duration: 0.125}]], 
        {onComplete: () => {
            animate([[scope.current, {scale: 1}, {duration: 0.125}]], {ease: "linear"})
            updateArtistHandler(artist)
        }},
        { ease: "linear" })
    }

    const clickResetHandler = () => {
        if (artistClicked) { return }
        animate([[scope.current, { opacity: 0 }, { duration: 0.25}]], 
            {onComplete: () => {
                animate([[scope.current, {opacity: 1}, {duration: 0.25}]], {ease: "linear"})
                resetHandler()
            }},
            { ease: "linear" })
    }

    return (
        <Flex align="center" direction="column"
            gap="lg" className="mt-5 pb-10 pl-5 pr-5">
            <Group justify="space-between" align="center" wrap='nowrap'
                styles={{ root: {width: "100%"} }}>
                {/* 160.46 is the width of of the CustomGameButton so that the logo is centered */}
                {width > phoneMaxWidth && <Space w={160.46}/>}
                <Stack gap="0px">
                    <Link href="/"><Image w={width > phoneMaxWidth ? 250 : 175} src="logo.png" alt="logo"></Image></Link>
                    {is_custom && <Text p="0px" c="gray.1" ta="center">Custom Game</Text>}
                </Stack>
                <CustomGameButton customModalOpen={customModalOpen}/>
                <CustomGameModal customModalOpened={customModalOpened} customModalHandlers={customModalHandlers} web={web}/>
            </Group>
            <Stack gap="xs">
                <Text size={width > phoneMaxWidth ? "md" : "sm"} ta="center">Use related artists to get from</Text>
                <Matchup ref={matchupRef} start={web[start]} end={web[end]} small={width <= phoneMaxWidth}/>
            </Stack>
            {won ? 
                <HoverButton onTap={winModalOpen}>
                    <Scoreboard guesses={guesses} resets={resets} greenBorder={won}/>
                </HoverButton>
                :
                <Scoreboard guesses={guesses} resets={resets} greenBorder={won}/>
            }
            <Popover position="bottom" opened={endMissed} transitionProps={{duration: 500, transition: 'pop' }}
            styles={{dropdown: {backgroundColor: "#e9ecef", border: 'none'}}}>
                <Popover.Target>
                    <RelatedArtistsTitle artist={currArtist} won={won} endArtist={web[end]}/>
                </Popover.Target>

                <Popover.Dropdown>
                    <Text c='gray.8' fw={700} size="md" ta="center">You missed {end}!</Text>
                </Popover.Dropdown>
            </Popover>
            <GameOver opened={winModalOpened} close={winModalClose} path={path} guesses={guesses}
             matchup={matchup} resets={resets} web={web} is_custom={is_custom} matchupID={matchupID}/>
            <AffixStatus currArtist={currArtist} endArtist={web[end]} guesses={guesses} 
            resets={resets} onTap={scrollToTop} mounted={!won && !entryAffix?.isIntersecting}/>
            <SimpleGrid ref={scope} cols={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5 }}>
            {currArtist.related.map((artist_name: string) => 
                <ArtistCard key={web[artist_name].id} artist={web[artist_name]} path={path}
                 won={won} end={end} clicked={artistClicked} setClicked={setArtistClicked}
                updateArtistHandler={(won || artist_name === end) ? updateArtistHandler : clickArtistHandler}/>)}
            </SimpleGrid>
            {!won && <Stack align='center' justify='center'>
                <Text ta="center" c='gray.1' size="md">Feeling stuck?</Text>
                <Group justify='center' align='center'>
                    {start !== currArtist.name && <Reset resetHandler={(won || currArtist.name === start) ? resetHandler : clickResetHandler}/>}
                    <Hint web={web} endArtist={web[end]} path={path} setUsedHint={useHintHandler}/>
                </Group>
            </Stack>}
            
            <Space h={24}/>
            <Text size={width > phoneMaxWidth ? "md" : "sm"}>Built by <Anchor c="green.6" href="https://karimkaylani.com/" target="_blank">Karim Kaylani</Anchor>. 
            Designed by <Anchor c="green.6" href="https://zade.design/" target="_blank">Zade Kaylani</Anchor>.</Text>
            <Group justify='center' align='center'>
                <CoffeeButton/>
                <Text c='gray.7'>|</Text>
                <HowToPlay start={web[start]} end={web[end]} opened={htpModalOpened} handlers={htpModalHandlers}/>
            </Group>
        </Flex>
    )
}

export default Game