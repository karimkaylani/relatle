"use client";

import React, { useEffect, useRef, useState } from "react";
import ArtistCard from "./ArtistCard";
import GameOver from "./GameOver";
import Reset from "./Reset";
import {
  Flex,
  SimpleGrid,
  Text,
  Image as MantineImage,
  Anchor,
  Stack,
  Group,
  Space,
  Popover,
  Loader,
  Center,
} from "@mantine/core";
import {
  useDisclosure,
  useIntersection,
  useMergedRef,
  useScrollIntoView,
} from "@mantine/hooks";
import Matchup from "./Matchup";
import Scoreboard from "./Scoreboard";
import RelatedArtistsTitle from "./RelatedArtistsTitle";
import HowToPlay from "./HowToPlay";
import HoverButton from "./HoverButton";
import { useSearchParams } from "next/navigation";
import CustomGameButton from "./CustomGameButton";
import CustomGameModal, { getValidPaths } from "./CustomGameModal";
import AffixStatus from "./AffixStatus";
import CoffeeButton from "./CoffeeButton";
import { useAnimate, useReducedMotion } from "framer-motion";
import Hint from "./Hint";
import NewFeatureModal from "./NewFeatureModal";
import { createClient } from "@/utils/supabase/client";
import GiveUp from "./GiveUp";
import {
  IconBrandGithub,
  IconBrandReddit,
  IconFlag2,
  IconRss,
} from "@tabler/icons-react";
import SideDrawer from "./SideDrawer";
import ClickableIcon from "./ClickableIcon";

export interface Artist {
  name: string;
  id: string;
  image: string;
  related: string[];
  top_song_name: string;
  top_song_preview_url: string;
  top_song_art: string;
}

interface GameProps {
  web: { [key: string]: Artist };
  is_custom: boolean;
  matchups: string[][];
}

interface SaveProps {
  currArtist?: Artist;
  path?: string[];
  won?: boolean;
  guesses?: number;
  resets?: number;
  matchup?: string[];
  gameOver?: boolean;
  usedHint?: boolean;
  prevMatchupID?: number;
  // This is really number of wins
  numDaysPlayed?: number;
  streak?: number;
  longestStreak?: number;
  sumScores?: number;
  averageScore?: number;
  sumResets?: number;
  averageResets?: number;
  gamesLost?: number;
  lowestScore?: number;
  highestScore?: number;
}

export const phoneMaxWidth = 768;
const maxCustomTextWidth = 565;

export interface iPlayingAudioContext {
  playingAudio: HTMLAudioElement | null;
  setPlayingAudio: (playingAudio: HTMLAudioElement | null) => void;
  playingArtist: Artist | null;
  setPlayingArtist: (playingArtist: Artist | null) => void;
}
export const PlayingAudioContext = React.createContext<iPlayingAudioContext>({
  playingAudio: null,
  setPlayingAudio: () => {},
  playingArtist: null,
  setPlayingArtist: () => {},
});

const addScoreToDB = async (
  is_custom: boolean,
  won: boolean,
  matchup: string[],
  matchupID: number,
  guesses: number,
  resets: number,
  path: string[],
  usedHint: boolean
): Promise<any> => {
  const date = new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
  });
  const supabase = createClient();

  if (is_custom) {
    return supabase.from("custom_game_scores").insert({
      timestamp: date,
      matchup: JSON.stringify(matchup),
      guesses,
      resets,
      path: JSON.stringify(path),
      used_hint: usedHint,
      won: won,
    });
  }

  if (!won) {
    return supabase.from("give_up_scores").insert({
      timestamp: date,
      matchup_id: matchupID,
      matchup: JSON.stringify(matchup),
      guesses,
      resets,
      path: JSON.stringify(path),
      used_hint: usedHint,
    });
  }

  return supabase.from("scores").insert({
    timestamp: date,
    matchup_id: matchupID,
    matchup: JSON.stringify(matchup),
    guesses,
    resets,
    path: JSON.stringify(path),
    used_hint: usedHint,
  });
};

const Game = (props: GameProps) => {
  const { is_custom, web, matchups } = props;
  const [matchup, setMatchup] = useState<any>(null);
  const [currArtist, setCurrArtist] = useState<any>(null);
  const [path, setPath] = useState<any>(null);
  const [won, setWon] = useState<boolean>(false);
  const [guesses, setGuesses] = useState<number>(0);
  const [resets, setResets] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const [prevMatchupID, setPrevMatchupID] = useState<number>(-1);
  const [numDaysPlayed, setNumDaysPlayed] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [sumScores, setSumScores] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [sumResets, setSumResets] = useState<number>(0);
  const [averageResets, setAverageResets] = useState<number>(0);
  const [gamesLost, setGamesLost] = useState<number>(0);
  const [lowestScore, setLowestScore] = useState<number>(0);
  const [highestScore, setHighestScore] = useState<number>(0);

  const [matchupID, setMatchupID] = useState<number>(-1);

  const [winModalOpened, winModalHandlers] = useDisclosure(false);
  const { open: winModalOpen, close: winModalClose } = winModalHandlers;

  const [htpModalOpened, htpModalHandlers] = useDisclosure(false);
  const { open: htpModalOpen } = htpModalHandlers;

  const [customModalOpened, customModalHandlers] = useDisclosure(false);
  const { open: customModalOpen } = customModalHandlers;

  const [newFeatureModalOpened, newFeatureModalHandlers] = useDisclosure(false);
  const { open: newFeatureModalOpen } = newFeatureModalHandlers;

  const [sidebarOpened, sidebarHandlers] = useDisclosure(false);
  const { open: sidebarOpen } = sidebarHandlers;

  const [usedHint, setUsedHint] = useState<boolean>(false);

  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [playingArtist, setPlayingArtist] = useState<Artist | null>(null);

  // For new feature modal pop-up
  const latestFeatureId = 0;

  const searchParams = useSearchParams();
  const { scrollIntoView, targetRef: scrollViewRef } =
    useScrollIntoView<HTMLDivElement>({
      duration: 500,
      offset: -10,
    });
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: affixRef, entry: entryAffix } = useIntersection({
    root: containerRef.current,
    threshold: 0,
  });

  const matchupRef = useMergedRef(scrollViewRef, affixRef);

  const [scope, animate] = useAnimate();
  // To prevent user from clicking on multiple artists at once
  // or reseting while executing artist click animation
  const [artistClicked, setArtistClicked] = useState(false);

  const [endMissed, setEndMissed] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const save = (saveData: SaveProps): void => {
    // if this is a save for a non-gameover state, wanna make sure we
    // don't lose streak data, avg score, etc. so we pull from state variables
    if (!is_custom && saveData.prevMatchupID === undefined) {
      saveData.prevMatchupID = prevMatchupID;
      saveData.numDaysPlayed = numDaysPlayed;
      saveData.streak = streak;
      saveData.longestStreak = longestStreak;
      saveData.sumScores = sumScores;
      saveData.averageScore = averageScore;
      saveData.sumResets = sumResets;
      saveData.averageResets = averageResets;
      saveData.gamesLost = gamesLost;
      saveData.lowestScore = lowestScore;
      saveData.highestScore = highestScore;
    }
    localStorage.setItem(
      is_custom ? "props_custom" : "props",
      JSON.stringify(saveData)
    );
  };

  const tryShowNewFeature = () => {
    if (
      JSON.parse(localStorage.getItem("newFeatureId") ?? "-1") < latestFeatureId
    ) {
      localStorage.setItem("newFeatureId", JSON.stringify(latestFeatureId));
      newFeatureModalOpen();
    }
  };

  const readLocalStroage = (custom: boolean): SaveProps | null => {
    // Ensure page is mounted to client before trying to read localStorage
    const item = localStorage.getItem(custom ? "props_custom" : "props");
    if (item === null) {
      return null;
    }
    const saveData = JSON.parse(item) as SaveProps;
    return saveData;
  };

  const loadLocalStorageIntoState = (
    todayMatchup: string[],
    matchup_id: number
  ): void => {
    // read in mainSave for streak, avg score, etc.
    const mainSave = readLocalStroage(false);
    let previous_matchup_id = mainSave?.prevMatchupID ?? -1;
    setPrevMatchupID(previous_matchup_id);
    setNumDaysPlayed(mainSave?.numDaysPlayed ?? 0);
    // Reset streak if user skips a day
    let new_streak = 0;
    if (
      previous_matchup_id !== -1 &&
      (previous_matchup_id === matchup_id - 1 ||
        previous_matchup_id === matchup_id)
    ) {
      new_streak = mainSave?.streak ?? 0;
    }
    setStreak(new_streak);
    setLongestStreak(mainSave?.longestStreak ?? 0);
    setSumScores(mainSave?.sumScores ?? 0);
    setAverageScore(mainSave?.averageScore ?? 0);
    setGamesLost(mainSave?.gamesLost ?? 0);
    setSumResets(mainSave?.sumResets ?? 0);
    setAverageResets(mainSave?.averageResets ?? 0);
    setLowestScore(mainSave?.lowestScore ?? 0);
    setHighestScore(mainSave?.highestScore ?? 0);

    const localSave = readLocalStroage(is_custom);
    if (localSave == null) {
      if (
        localStorage.getItem("props") == null &&
        localStorage.getItem("props_custom") == null
      ) {
        // If first time playing, don't wanna show new feature modal
        localStorage.setItem("newFeatureId", JSON.stringify(latestFeatureId));
        htpModalOpen();
      } else {
        tryShowNewFeature();
      }
      return;
    }

    if (JSON.stringify(localSave.matchup) !== JSON.stringify(todayMatchup)) {
      // See if need to serve newFeature modal
      tryShowNewFeature();
      return;
    }
    // Use localsave here since we want to preserve the state of the game
    // Don't need to set matchup here, since it is set in useEffect
    setCurrArtist(localSave.currArtist);
    setPath(localSave.path);
    setGuesses(localSave.guesses ?? 0);
    setResets(localSave.resets ?? 0);
    setUsedHint(localSave.usedHint ?? false);
    let wonValue = localSave.won ?? false;
    setWon(wonValue);
    let gameWonValue = localSave.gameOver ?? wonValue;
    setGameOver(gameWonValue);
    if (gameWonValue && !searchParams.get("transfer")) {
      winModalOpen();
    }
  };

  const getTodaysMatchup = (matchups: string[][]): any => {
    if (matchups == null) {
      return;
    }
    /* to preserve correct matchupID -> matchup mapping, since some matchups were deleted
        as they are no longer recommended matchups
        If deleting a matchup that has already passed: enumerate this by 1 */
    const matchupIndexPadding = 29;
    // Launch of relatle, matchupID is # of days (matchups) since 11/29/2023
    const startingDate = new Date(2023, 10, 29);

    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round(
      Math.abs((today.getTime() - startingDate.getTime()) / oneDay)
    );

    const matchupIndex = (diffDays - matchupIndexPadding) % matchups.length;
    const matchup = matchups[matchupIndex];
    let matchup_id = diffDays + 1;
    setMatchupID(matchup_id);
    return [matchup, matchup_id];
  };

  // When component first mounts, load in localStorage
  // use loading so that nothing renders until localStorage is checked
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Put in here to ensure we're getting client time,
    // as well as all other state variables that rely
    // on our matchup
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    let custom_matchup = [start, end];
    let [todayMatchup, matchup_id] = getTodaysMatchup(matchups);
    if (is_custom) {
      todayMatchup = custom_matchup;
    }
    if (todayMatchup == null) {
      return;
    }
    setMatchup(todayMatchup);
    setCurrArtist(web[todayMatchup[0]]);
    setPath([todayMatchup[0]]);
    loadLocalStorageIntoState(todayMatchup, matchup_id);
    setLoading(false);
    // preload modal images
    new Image().src = "images/give-up.png";
    new Image().src = "images/how-to-play.png";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [width, setWidth] = useState(0);
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <Center className="pt-14">
        <Loader size="lg" color="green.6" />
      </Center>
    );
  }

  const [start, end] = matchup;

  if (
    !(start in web) ||
    !(end in web) ||
    start === end ||
    getValidPaths(web, start, end, Infinity).length === 0
  ) {
    window.open("/", "_self");
    return;
  }

  const scrollToTop = () => {
    if (!entryAffix?.isIntersecting) {
      scrollIntoView();
    }
  };

  const winHandler = (newGuesses: number, newPath: string[]) => {
    setWon(true);
    setGameOver(true);
    // DAILY GAME
    if (!is_custom) {
      let new_streak = streak + 1;
      let new_longest_streak =
        new_streak > longestStreak ? new_streak : longestStreak;
      setPrevMatchupID(matchupID);
      const newNumDaysPlayed = numDaysPlayed + 1;
      setNumDaysPlayed(newNumDaysPlayed);
      setStreak(new_streak);
      setLongestStreak(new_longest_streak);

      const new_sum_scores = sumScores + newGuesses;
      setSumScores(new_sum_scores);
      const new_average_score = new_sum_scores / newNumDaysPlayed;
      setAverageScore(new_average_score);

      const new_sum_resets = sumResets + resets;
      setSumResets(new_sum_resets);
      const new_average_resets = new_sum_resets / newNumDaysPlayed;
      setAverageResets(new_average_resets);

      let new_lowest_score = lowestScore;
      // default value of 0 means no lowest score yet
      if (new_lowest_score === 0) {
        new_lowest_score = newGuesses;
      } else if (newGuesses < lowestScore) {
        new_lowest_score = newGuesses;
      }
      setLowestScore(new_lowest_score);
      const new_highest_score =
        newGuesses > highestScore ? newGuesses : highestScore;
      setHighestScore(new_highest_score);
      save({
        currArtist,
        path: newPath,
        won: true,
        guesses: newGuesses,
        gameOver: true,
        resets,
        matchup,
        usedHint,
        prevMatchupID: matchupID,
        numDaysPlayed: newNumDaysPlayed,
        streak: new_streak,
        longestStreak: new_longest_streak,
        sumScores: new_sum_scores,
        averageScore: new_average_score,
        sumResets: new_sum_resets,
        averageResets: new_average_resets,
        gamesLost,
        lowestScore: new_lowest_score,
        highestScore: new_highest_score,
      });
      // CUSTOM GAME
    } else {
      save({
        currArtist,
        path: newPath,
        won: true,
        guesses: newGuesses,
        gameOver: true,
        resets,
        matchup,
        usedHint,
      });
    }
    winModalOpen();
    if (process.env.NODE_ENV !== "development") {
      addScoreToDB(
        is_custom,
        true,
        matchup,
        matchupID,
        newGuesses,
        resets,
        newPath,
        usedHint
      );
    }
  };

  const updateArtistHandler = (artist: Artist) => {
    setArtistClicked(false);
    if (gameOver) {
      if (artist.name === end) {
        winModalOpen();
      }
      return;
    }
    const newPath = [...path, artist.name];
    const newGuesses = guesses + 1;
    setPath(newPath);
    setGuesses(newGuesses);
    if (artist.name === end) {
      winHandler(newGuesses, newPath);
      return;
    }
    scrollToTop();
    const prevCurrArtist = currArtist;
    if (prevCurrArtist.related.includes(end)) {
      missedArtistHandler();
    }
    setCurrArtist(artist);
    save({
      currArtist: artist,
      path: newPath,
      won,
      gameOver,
      guesses: newGuesses,
      resets,
      matchup,
      usedHint,
    });
  };

  const resetHandler = (): void => {
    if (gameOver || currArtist.name == start) {
      return;
    }
    if (currArtist.related.includes(end)) {
      missedArtistHandler();
    }
    scrollToTop();
    const newPath = [...path, "RESET"];
    setPath(newPath);
    const newResets = resets + 1;
    setResets(newResets);
    setCurrArtist(web[start]);
    save({
      currArtist: web[start],
      path: newPath,
      won,
      guesses,
      gameOver,
      resets: newResets,
      matchup,
      usedHint,
    });
  };

  const useHintHandler = (): void => {
    if (usedHint) {
      return;
    }
    setUsedHint(true);
    save({
      currArtist,
      path,
      won,
      gameOver,
      guesses,
      resets,
      matchup,
      usedHint: true,
    });
  };

  const giveUpHandler = (): void => {
    if (gameOver) {
      return;
    }
    setGameOver(true);
    winModalOpen();
    let newPath = [...path, "GIVE UP"];
    setPath(newPath);

    // DAILY GAME
    if (!is_custom) {
      let previousMatchupID = matchupID;
      setPrevMatchupID(previousMatchupID);

      let new_streak = 0;
      setStreak(new_streak);

      let new_games_lost = gamesLost + 1;
      setGamesLost(new_games_lost);
      save({
        currArtist,
        path: newPath,
        won,
        guesses,
        gameOver: true,
        resets,
        matchup,
        usedHint,
        prevMatchupID: previousMatchupID,
        numDaysPlayed,
        streak: new_streak,
        longestStreak,
        sumScores,
        averageScore,
        sumResets,
        averageResets,
        gamesLost: new_games_lost,
        lowestScore,
        highestScore,
      });
      // CUSTOM GAME
    } else {
      save({
        currArtist,
        path: newPath,
        won,
        guesses,
        gameOver: true,
        resets,
        matchup,
        usedHint,
      });
    }

    if (process.env.NODE_ENV !== "development") {
      addScoreToDB(
        is_custom,
        false,
        matchup,
        matchupID,
        guesses,
        resets,
        newPath,
        usedHint
      );
    }
  };

  const missedArtistHandler = (): void => {
    setEndMissed(true);
    setTimeout(() => setEndMissed(false), 2000);
  };

  const clickArtistHandler = (artist: Artist) => {
    if (shouldReduceMotion) {
      updateArtistHandler(artist);
      return;
    }
    animate(
      [[scope.current, { scale: 0.95 }, { duration: 0.125 }]],
      {
        onComplete: () => {
          animate([[scope.current, { scale: 1 }, { duration: 0.125 }]], {
            ease: "linear",
          });
          updateArtistHandler(artist);
        },
      },
      { ease: "linear" }
    );
  };

  const clickResetHandler = () => {
    if (artistClicked) {
      return;
    }
    if (shouldReduceMotion) {
      resetHandler();
      return;
    }
    animate(
      [[scope.current, { opacity: 0 }, { duration: 0.25 }]],
      {
        onComplete: () => {
          animate([[scope.current, { opacity: 1 }, { duration: 0.25 }]], {
            ease: "linear",
          });
          resetHandler();
        },
      },
      { ease: "linear" }
    );
  };

  return (
    <Flex
      align="center"
      direction="column"
      gap="lg"
      className="mt-5 pb-10 pl-5 pr-5"
    >
      <Group
        justify="space-between"
        align="center"
        wrap="nowrap"
        styles={{ root: { width: "100%" } }}
      >
        {/* Widths of CustomGameButton so that the logo is centered */}
        <div
          style={{
            width:
              width >= phoneMaxWidth
                ? 147.35
                : width >= maxCustomTextWidth
                ? 133.16
                : undefined,
          }}
        >
          <SideDrawer
            opened={sidebarOpened}
            handlers={sidebarHandlers}
            streak={streak}
            longest_streak={longestStreak}
            games_won={numDaysPlayed}
            total_guesses={sumScores}
            average_score={averageScore}
            average_resets={averageResets}
            total_resets={sumResets}
            games_lost={gamesLost}
            lowest_score={lowestScore}
            highest_score={highestScore}
            customModalOpen={customModalOpen}
            htpOpen={htpModalOpen}
          />
        </div>
        <Stack gap="0px">
          <a href={is_custom ? "/" : undefined}>
            <MantineImage
              style={{ cursor: "pointer" }}
              w={width > phoneMaxWidth ? 250 : 175}
              src="images/logo.png"
              alt="Relatle Logo"
            ></MantineImage>
          </a>
          {is_custom && (
            <Text p="0px" c="gray.1" ta="center">
              Custom Game
            </Text>
          )}
        </Stack>
        <CustomGameButton
          customModalOpen={customModalOpen}
          showText={width >= maxCustomTextWidth}
        />
        <CustomGameModal
          customModalOpened={customModalOpened}
          customModalHandlers={customModalHandlers}
          web={web}
          matchups={Object.values(matchups ?? {})}
        />
      </Group>
      <Stack gap="xs">
        <Text size={width > phoneMaxWidth ? "md" : "sm"} ta="center">
          Use related artists to get from
        </Text>
        <PlayingAudioContext.Provider
          value={{
            playingAudio,
            setPlayingAudio,
            playingArtist,
            setPlayingArtist,
          }}
        >
          <Matchup
            ref={matchupRef}
            start={web[start]}
            end={web[end]}
            small={width <= phoneMaxWidth}
            showPreviews={true}
          />
        </PlayingAudioContext.Provider>
      </Stack>
      {gameOver ? (
        <HoverButton onTap={winModalOpen}>
          <Scoreboard
            guesses={guesses}
            resets={resets}
            borderColor={won ? "#40c057" : "#fa5252"}
          />
        </HoverButton>
      ) : (
        <Scoreboard guesses={guesses} resets={resets} />
      )}
      <Popover
        position="bottom"
        opened={endMissed}
        transitionProps={{ duration: 500, transition: "pop" }}
        styles={{ dropdown: { backgroundColor: "#e9ecef", border: "none" } }}
      >
        <Popover.Target>
          <RelatedArtistsTitle
            artist={currArtist}
            won={won}
            gameOver={gameOver}
            endArtist={web[end]}
          />
        </Popover.Target>

        <Popover.Dropdown>
          <Text c="gray.8" fw={700} size="md" ta="center">
            You missed {end}!
          </Text>
        </Popover.Dropdown>
      </Popover>
      <GameOver
        opened={winModalOpened}
        close={winModalClose}
        path={path}
        guesses={guesses}
        won={won}
        matchup={matchup}
        resets={resets}
        web={web}
        is_custom={is_custom}
        matchupID={matchupID}
        streak={streak}
        longest_streak={longestStreak}
        days_played={numDaysPlayed}
        customModalOpen={customModalOpen}
      />
      <PlayingAudioContext.Provider
        value={{
          playingAudio,
          setPlayingAudio,
          playingArtist,
          setPlayingArtist,
        }}
      >
        <AffixStatus
          currArtist={currArtist}
          endArtist={web[end]}
          guesses={guesses}
          resets={resets}
          onTap={scrollToTop}
          scrolled={!entryAffix?.isIntersecting}
          gameOver={gameOver}
          sideDrawerOpened={sidebarOpened}
        />
      </PlayingAudioContext.Provider>
      <PlayingAudioContext.Provider
        value={{
          playingAudio,
          setPlayingAudio,
          playingArtist,
          setPlayingArtist,
        }}
      >
        <SimpleGrid ref={scope} cols={{ base: 2, xs: 3, sm: 3, md: 4, lg: 5 }}>
          {currArtist.related.map((artist_name: string) => (
            <ArtistCard
              key={web[artist_name].id}
              artist={web[artist_name]}
              path={path}
              won={won}
              gameOver={gameOver}
              end={end}
              clicked={artistClicked}
              setClicked={setArtistClicked}
              updateArtistHandler={
                gameOver || artist_name === end
                  ? updateArtistHandler
                  : clickArtistHandler
              }
            />
          ))}
        </SimpleGrid>
      </PlayingAudioContext.Provider>
      <Text ta="center" size={window.innerWidth <= phoneMaxWidth ? "sm" : "md"}>
        Press and hold on an artist to hear their music!
      </Text>
      {!gameOver && (
        <Stack align="center" justify="center">
          <Text ta="center" c="gray.1" size="md">
            Feeling stuck?
          </Text>
          <Group justify="center" align="center">
            {start !== currArtist.name && (
              <Reset resetHandler={clickResetHandler} />
            )}
            <PlayingAudioContext.Provider
              value={{
                playingAudio,
                setPlayingAudio,
                playingArtist,
                setPlayingArtist,
              }}
            >
              <Hint
                web={web}
                endArtist={web[end]}
                path={path}
                setUsedHint={useHintHandler}
              />
            </PlayingAudioContext.Provider>
          </Group>
        </Stack>
      )}
      {!gameOver && guesses >= 1 && (
        <GiveUp giveUpHandler={giveUpHandler} is_custom={is_custom} />
      )}
      <Space h={24} />
      <Text ta="center" size={width > phoneMaxWidth ? "md" : "sm"}>
        Created by{" "}
        <Anchor c="green.6" href="https://karimkaylani.com/" target="_blank">
          Karim Kaylani
        </Anchor>
        . Designed by{" "}
        <Anchor c="green.6" href="https://zade.design/" target="_blank">
          Zade Kaylani
        </Anchor>
        .
      </Text>
      <Group justify="center" align="center">
        <Group>
          <ClickableIcon
            icon={<IconBrandReddit aria-label="Visit r/relatle on Reddit" />}
            url="https://reddit.com/r/relatle"
          />
          <ClickableIcon
            icon={<IconBrandGithub aria-label="Open source code on GitHub" />}
            url="https://github.com/karimkaylani/relatle/"
          />
        </Group>
        <Text c="gray.7">|</Text>
        <CoffeeButton />
        <Text c="gray.7">|</Text>
        <Group>
          <ClickableIcon
            icon={<IconFlag2 aria-label="Send Feedback" />}
            url="https://docs.google.com/forms/d/e/1FAIpQLSeMEW3eGqVXheqidY43q9yMVK2QCi-AEJV3JGTuPK4LX9U9eA/viewform?usp=sf_link"
          />
          <HowToPlay
            start={web[start]}
            end={web[end]}
            opened={htpModalOpened}
            handlers={htpModalHandlers}
          />
        </Group>
      </Group>
      <NewFeatureModal
        newFeatureModalOpened={newFeatureModalOpened}
        newFeatureModalHandlers={newFeatureModalHandlers}
      />
    </Flex>
  );
};

export default Game;
