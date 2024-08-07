"use client";

import React, { useEffect, useRef, useState } from "react";
import ArtistCard from "./ArtistCard";
import GameOver, { getMinPath } from "./GameOver";
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
  Affix,
  Transition,
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
import { useRouter, useSearchParams } from "next/navigation";
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
  IconHistory,
  IconRss,
  IconTrophy,
} from "@tabler/icons-react";
import SideDrawer from "./SideDrawer";
import ClickableIcon from "./ClickableIcon";
import { green, white, red, gray7, gray9, gray8, yellow } from "../colors";
import PathModal from "./PathModal";
import Link from "next/link";
import Logo from "./Logo";
import IconHoverButton from "./IconHoverButton";
import TopGamesButton from "./TopGamesButton";
import ArchiveButton from "./ArchiveButton";
import MainContainer from "./MainContainer";
import IFrameModal from "./IFrameModal";

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
  numPerfectGames?: number;
}

export const phoneMaxWidth = 768;
export const maxCustomTextWidth = 680;
export const maxButtonGrowWidth = 370;
export const watermarkWidth = 1150;
export const feedBackForm =
  "https://docs.google.com/forms/d/e/1FAIpQLSeMEW3eGqVXheqidY43q9yMVK2QCi-AEJV3JGTuPK4LX9U9eA/viewform?usp=sf_link";

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

/* to preserve correct matchupID -> matchup mapping, since some matchups were deleted
      as they are no longer recommended matchups
      If deleting a matchup that has already passed: enumerate this by 1 */
export const matchupIndexPadding = 81;

// Launch of relatle, matchupID is # of days (matchups) since 11/29/2023
export const startingDate = new Date(2023, 10, 29);

export const getTodaysMatchup = (matchups: string[][]): any => {
  if (matchups == null) {
    return;
  }

  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round(
    Math.abs((today.getTime() - startingDate.getTime()) / oneDay)
  );
  const matchupIndex = (diffDays - matchupIndexPadding) % matchups.length;
  const matchup = matchups[matchupIndex];
  let matchup_id = diffDays + 1;
  return [matchup, matchup_id];
};

const Game = (props: GameProps) => {
  const { is_custom, web, matchups: localMatchups } = props;
  const [matchups, setMatchups] = useState<string[][]>(localMatchups);
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
  const [numPerfectGames, setNumPerfectGames] = useState<number>(0);

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

  const [pathModalOpened, pathModalHandlers] = useDisclosure(false);
  const { open: pathModalOpen } = pathModalHandlers;

  const [iframeModalOpened, iframeModalHandlers] = useDisclosure(false);
  const { open: iframeModalOpen } = iframeModalHandlers;

  const [usedHint, setUsedHint] = useState<boolean>(false);

  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [playingArtist, setPlayingArtist] = useState<Artist | null>(null);

  const router = useRouter();

  // For new feature modal pop-up
  const latestFeatureId = 3;

  // For affix-status
  const searchParams = useSearchParams();
  const { scrollIntoView, targetRef: scrollViewRef } =
    useScrollIntoView<HTMLDivElement>({
      duration: 500,
      offset: -10,
    });
  // For logo pop-up
  const matchupContainerRef = useRef<HTMLDivElement>(null);
  const { ref: affixRef, entry: entryAffix } = useIntersection({
    root: matchupContainerRef.current,
    threshold: 0,
  });

  // For determining if should scroll (can see all artists)
  const artistGridContainerRef = useRef<HTMLDivElement>(null);
  const { ref: artistGridRef, entry: entryArtistGrid } = useIntersection({
    root: artistGridContainerRef.current,
    threshold: 1,
  });

  const matchupRef = useMergedRef(scrollViewRef, affixRef);

  const logoContainerRef = useRef<HTMLDivElement>(null);
  const { ref: logoRef, entry: entryLogo } = useIntersection({
    root: logoContainerRef.current,
    threshold: 0.8,
  });

  const [scope, animate] = useAnimate();

  const gridRef = useMergedRef(scope, artistGridRef);
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
      saveData.numPerfectGames = numPerfectGames;
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
    setNumPerfectGames(mainSave?.numPerfectGames ?? 0);

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

  // Ensure newest matchup data
  useEffect(() => {
    if (!is_custom) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/data/matchups.json`, {
        cache: "no-cache",
      })
        .then((response) => response.json())
        .then((data) => {
          if (
            data &&
            Object.keys(data).length > 1 &&
            JSON.stringify(data) !== JSON.stringify(matchups)
          ) {
            setMatchups(data);
            setLoading(true);
          }
        });
    }

    // preload images in modals
    const preloadImage = (src: string) => {
      const image = new Image();
      image.src = src;
    };
    preloadImage("images/give-up.png");
    preloadImage("images/how-to-play.png");
    // if page is loaded in iframe, open iframe modal
    if (window.location !== window.parent.location) {
      iframeModalOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setMatchupID(matchup_id);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchups]);

  const [width, setWidth] = useState(0);
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Refresh if current time would yield a new matchup
  useEffect(() => {
    const interval = setInterval(() => {
      if (is_custom || matchupID === -1) {
        return;
      }
      let new_matchup_id = getTodaysMatchup(matchups)[1];
      if (new_matchup_id !== matchupID) {
        window.location.href = window.location.pathname;
      }
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [matchupID, matchups, is_custom]);

  if (loading) {
    return (
      <Center className="pt-14">
        <Loader size="lg" color={green} />
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
    if (is_custom) {
      router.push("/");
      return;
    }
    return (
      <Center className="pt-14">
        <Text size="xl" fw={700} ta="center">
          This matchup is not valid.
        </Text>
      </Center>
    );
  }

  const scrollToTop = () => {
    if (!entryAffix?.isIntersecting && !entryArtistGrid?.isIntersecting) {
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

      let new_num_perfect_games = numPerfectGames;
      let shortest_path = getMinPath(web, start, end);
      if (newGuesses === shortest_path.length) {
        new_num_perfect_games += 1;
      }
      setNumPerfectGames(new_num_perfect_games);
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
        numPerfectGames: new_num_perfect_games,
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
        numPerfectGames,
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
    <MainContainer>
      <Group
        justify="space-between"
        align="center"
        wrap="nowrap"
        gap="sm"
        styles={{ root: { width: "100%", maxWidth: "816px" } }}
      >
        <Group
          wrap="nowrap"
          style={{
            flexGrow: 1,
            flexBasis: 0,
            display: "flex",
            justifyContent: "flex-start",
          }}
          gap="8px"
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
          <ArchiveButton showText={width > maxCustomTextWidth} />
        </Group>
        <Link href={is_custom ? "/" : ""}>
          <Stack gap="0px" ref={logoRef}>
            <Logo />
            {is_custom && (
              <Text p="0px" c={white} ta="center">
                Custom Game
              </Text>
            )}
          </Stack>
        </Link>
        <Group
          wrap="nowrap"
          style={{
            flexGrow: 1,
            flexBasis: 0,
            display: "flex",
            justifyContent: "flex-end",
          }}
          gap="8px"
        >
          <TopGamesButton showText={width > maxCustomTextWidth} />
          <CustomGameButton
            customModalOpen={customModalOpen}
            showText={width >= maxCustomTextWidth}
          />
        </Group>
      </Group>
      <CustomGameModal
        customModalOpened={customModalOpened}
        customModalHandlers={customModalHandlers}
        web={web}
        matchups={Object.values(matchups ?? {})}
      />
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
      <HoverButton onTap={gameOver ? winModalOpen : pathModalOpen}>
        <Scoreboard
          guesses={guesses}
          resets={resets}
          borderColor={gameOver ? (won ? green : red) : undefined}
        />
      </HoverButton>
      <PathModal
        opened={pathModalOpened}
        handlers={pathModalHandlers}
        path={path}
        matchup={matchup}
        guesses={guesses}
        resets={resets}
        web={web}
      />
      <Popover
        position="bottom"
        opened={endMissed}
        transitionProps={{ duration: 500, transition: "pop" }}
        styles={{ dropdown: { backgroundColor: gray7 } }}
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
          <Text c={white} fw={700} size="md" ta="center">
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
        customModalOpen={customModalOpen}
        openStats={sidebarOpen}
        streak={streak}
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
          scrolled={entryAffix !== null && !entryAffix.isIntersecting}
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
        <SimpleGrid ref={gridRef} cols={{ base: 2, xs: 3, sm: 4, md: 4, lg: 4 }}>
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
          <Text ta="center" c={white} size="md">
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
            {!gameOver && guesses >= 1 && (
              <GiveUp giveUpHandler={giveUpHandler} is_custom={is_custom} />
            )}
          </Group>
        </Stack>
      )}

      <Space h={24} />
      <Text ta="center" size={width > phoneMaxWidth ? "md" : "sm"}>
        Created by{" "}
        <Anchor c={green} href="https://karimkaylani.com/" target="_blank">
          Karim Kaylani
        </Anchor>
        . Designed by{" "}
        <Anchor c={green} href="https://zade.design/" target="_blank">
          Zade Kaylani
        </Anchor>
        .
      </Text>
      <Group gap="8px" justify="center" align="center">
        <Group justify="space-between" align="center" gap="md">
          <ClickableIcon
            icon={<IconBrandReddit aria-label="Visit r/relatle on Reddit" />}
            url="https://reddit.com/r/relatle"
          />
          <ClickableIcon
            icon={<IconBrandGithub aria-label="Open source code on GitHub" />}
            url="https://github.com/karimkaylani/relatle/"
          />
        </Group>
        <Text c={gray7}>|</Text>
        <CoffeeButton />
        <Text c={gray7}>|</Text>
        <Group justify="space-between" align="center" gap="md">
          <ClickableIcon
            icon={<IconFlag2 aria-label="Send Feedback" />}
            url={feedBackForm}
          />
          <HowToPlay
            start={web[start]}
            end={web[end]}
            opened={htpModalOpened}
            handlers={htpModalHandlers}
          />
        </Group>
      </Group>
      <IFrameModal opened={iframeModalOpened} handlers={iframeModalHandlers} />
      <NewFeatureModal
        newFeatureModalOpened={newFeatureModalOpened}
        newFeatureModalHandlers={newFeatureModalHandlers}
      />
      {width > watermarkWidth && (
        <Affix position={{ bottom: 20, right: 20 }}>
          <Transition
            mounted={entryLogo !== null && !entryLogo?.isIntersecting}
            transition="slide-left"
            duration={200}
            timingFunction="ease"
          >
            {(styles) => (
              <div style={styles}>
                <MantineImage
                  w={150}
                  src="images/logo.png"
                  alt="Relatle Logo"
                ></MantineImage>
              </div>
            )}
          </Transition>
        </Affix>
      )}
    </MainContainer>
  );
};

export default Game;
