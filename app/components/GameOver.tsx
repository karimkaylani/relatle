"use client";

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Text,
  Flex,
  Group,
  Collapse,
  Button,
  Drawer,
  Affix,
  Card,
  Transition,
  Stack,
  Divider,
  Loader,
  Center,
} from "@mantine/core";
import ShareResults from "./ShareResults";
import { Artist, phoneMaxWidth } from "./Game";
import ScrollablePath from "./ScrollablePath";
import Scoreboard from "./Scoreboard";
import SharePath from "./SharePath";
import * as Collections from "typescript-collections";
import {
  IconArrowDown,
  IconArrowUp,
  IconBolt,
  IconChartBar,
  IconStar,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Matchup from "./Matchup";
import { useSwipeable } from "react-swipeable";
import CountdownClock from "./CountdownClock";
import CustomGameButton from "./CustomGameButton";
import GlobalScoreStats from "./GlobalScoreStats";
import { white, green, gray9, gray8 } from "../colors";
import RelatleButton from "./RelatleButton";
import { getStats, Stats } from "../db";
import Realistic from "react-canvas-confetti/dist/presets/fireworks";
import TopGamesButton from "./TopGamesButton";
import ArchiveButton from "./ArchiveButton";
import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import ShortestPathCarousel from "./ShortestPathCarousel";

export interface GameOverProps {
  opened: boolean;
  close: () => void;
  path: string[];
  guesses: number;
  matchup: string[];
  resets: number;
  won: boolean;
  web: { [key: string]: Artist };
  is_custom: boolean;
  matchupID: number;
  customModalOpen: () => void;
  openStats: () => void;
  streak: number;
}

export const getMinPath = (
  web: { [key: string]: Artist },
  start: string,
  end: string
): string[] => {
  const visited: Set<string> = new Set();
  const queue: Collections.Queue<[string, string[]]> = new Collections.Queue();
  queue.enqueue([start, []]);

  while (!queue.isEmpty()) {
    const item = queue.dequeue();
    if (item === undefined) {
      return [];
    }
    const [node, path] = item;
    if (node === end) {
      return path;
    }
    if (!visited.has(node)) {
      visited.add(node);
      for (const neighbor of web[node].related || []) {
        queue.enqueue([neighbor, path.concat(neighbor)]);
      }
    }
  }
  return [];
};

export const getMinPaths = (
  web: { [key: string]: Artist },
  start: string,
  end: string
): string[][] => {
  // get all of the paths that are the minimum length
  const visited: Set<string> = new Set();
  const queue: Collections.Queue<[string, string[]]> = new Collections.Queue();
  queue.enqueue([start, []]);
  const paths: string[][] = [];

  while (!queue.isEmpty()) {
    const item = queue.dequeue();
    if (item === undefined) {
      return [];
    }
    const [node, path] = item;
    if (node === end) {
      paths.push(path);
    }
    if (!visited.has(node)) {
      visited.add(node);
      for (const neighbor of web[node].related || []) {
        queue.enqueue([neighbor, path.concat(neighbor)]);
      }
    }

    // if we have paths already and the current path is longer than the shortest path
    // we can stop searching
    if (paths.length > 0 && path.length > paths[0].length) {
      break;
    }
  }

  for (let i = 0; i < paths.length; i++) {
    paths[i].unshift(start);
  }
  return paths;
};

export const minPathCollapseAnimationDuration = 200;

const GameOver = ({
  opened,
  close,
  path,
  guesses,
  won,
  matchup,
  resets,
  web,
  is_custom,
  matchupID,
  customModalOpen,
  openStats,
  streak,
}: GameOverProps) => {
  const [start, end] = matchup;
  const [
    minPathOpened,
    { open: openMinPath, close: closeMinPath, toggle: toggleMinPath },
  ] = useDisclosure(!won);
  const [showMinCarousel, setShowMinCarousel] = useState<boolean>(!won);
  const [pathOpened, { open: openPath, close: closePath, toggle: togglePath }] =
    useDisclosure(false);

  const headerSwipeHandlers = useSwipeable({
    onSwipedDown: close,
  });

  const [minPaths, setMinPaths] = useState<string[][]>([]);
  const [minPathLength, setMinPathLength] = useState<number>(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingGlobalScore, setLoadingGlobalScore] = useState<boolean>(true);
  const [confetti, setConfetti] = useState<boolean>(false);

  // delay hiding carousel to allow animation to finish
  useEffect(() => {
    if (minPathOpened) {
      setShowMinCarousel(true);
    } else {
      setTimeout(() => {
        setShowMinCarousel(false);
      }, minPathCollapseAnimationDuration);
    }
  }, [minPathOpened]);

  const numMinPaths = 5;

  const confettiDecorateOptions = (defaultOptions: any) => {
    return {
      ...defaultOptions,
      colors: [green],
    };
  };

  // toggle confetti function with delay
  const toggleConfetti = () => {
    if (confetti) {
      return;
    }
    setConfetti(true);
    setTimeout(() => {
      setConfetti(false);
    }, 1500);
  };

  useEffect(() => {
    if (!opened || !loadingGlobalScore || minPaths.length > 0) {
      return;
    }
    const mPath = getMinPaths(web, start, end).slice(0, numMinPaths);
    let mPathLength = mPath[0].length - 1;
    // minus 1 because the start artist is not counted
    setMinPathLength(mPathLength);
    if (won && guesses === mPathLength) {
      toggleConfetti();
    }
    setMinPaths(
      mPath.filter(
        (min_path) => JSON.stringify(min_path) !== JSON.stringify(path)
      )
    );
    getStats(matchup, mPathLength)
      .then((res) => {
        if (!res) {
          openPath();
        }
        setStats(res);
        setLoadingGlobalScore(false);
      })
      .catch((e) => {
        console.error(e);
        setLoadingGlobalScore(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const [height, setHeight] = useState(86);
  const ref = useRef<HTMLDivElement>(null);

  const handleResize = () => setHeight(ref.current?.clientHeight ?? 86);

  const shortestPathButtonText =
    (guesses === minPathLength ? "Other " : "") +
    "Shortest Path" +
    (minPaths.length > 1 ? "s" : "") +
    " (" +
    minPathLength +
    " guesses)";

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Drawer.Root
      opened={opened}
      onClose={close}
      size={window.innerWidth > phoneMaxWidth ? "80%" : "88%"}
      style={{ borderRadius: "20px" }}
      padding="sm"
      position={"bottom"}
    >
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Header
          {...headerSwipeHandlers}
          style={{ top: -1 }}
          onClick={close}
        >
          <Drawer.Title style={{ width: "100%" }}>
            <Text ta="center" c={white} size="xl" fw={700}>
              {won ? "You Won!" : "Game Over"}
            </Text>
          </Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
          <Flex
            align="center"
            direction="column"
            gap="lg"
            styles={{ root: { marginBottom: height + 15 } }}
          >
            <Matchup
              start={web[start]}
              end={web[end]}
              small={window.innerWidth > phoneMaxWidth ? false : true}
            />
            <Scoreboard
              guesses={guesses}
              resets={resets}
              small={window.innerWidth > phoneMaxWidth ? false : true}
              streak={!is_custom ? streak : undefined}
            />
            {confetti && (
              <Realistic
                autorun={{ speed: 0.3 }}
                decorateOptions={confettiDecorateOptions}
              />
            )}
            {won && guesses === minPathLength && (
              <RelatleButton
                size="sm"
                icon={<IconStar size={18} />}
                text={"You got the Shortest Path!"}
                color={green}
                onClick={toggleConfetti}
              />
            )}
            <RelatleButton
              size="sm"
              icon={
                <Text size="lg" c={white}>
                  {pathOpened ? "–" : "+"}
                </Text>
              }
              color={white}
              text={pathOpened ? "Hide Your Path" : "Show Your Path"}
              onClick={togglePath}
            />
            <Collapse in={pathOpened}>
              <ScrollablePath matchup={matchup} web={web} path={path} />
            </Collapse>

            {minPaths.length > 0 && (
              <>
                <RelatleButton
                  size="sm"
                  icon={
                    <Text size="lg" c={white}>
                      {minPathOpened ? "–" : "+"}
                    </Text>
                  }
                  color={white}
                  text={
                    minPathOpened
                      ? "Hide " + shortestPathButtonText
                      : "Show " + shortestPathButtonText
                  }
                  onClick={toggleMinPath}
                />

                <Collapse
                  in={minPathOpened}
                  transitionDuration={minPathCollapseAnimationDuration}
                >
                  {showMinCarousel && (
                    <ShortestPathCarousel
                      matchup={matchup}
                      web={web}
                      minPaths={minPaths}
                    />
                  )}
                </Collapse>
              </>
            )}

            {loadingGlobalScore ? (
              <Loader color={green} size="sm" />
            ) : (
              stats && (
                <GlobalScoreStats
                  won={won}
                  guesses={guesses}
                  stats={stats}
                  shortestPath={minPathLength}
                />
              )
            )}
            {!is_custom && (
              <RelatleButton
                color={white}
                size="sm"
                text="View Your All-Time Stats"
                onClick={() => {
                  close();
                  openStats();
                }}
                icon={<IconChartBar size={18} color={white} />}
              />
            )}
            {!is_custom && <CountdownClock />}
            <Stack gap="xs" align="center">
              <Text fw={700} size="md">
                Play another!
              </Text>
              <Group justify="center" align="center">
                <ArchiveButton />
                <TopGamesButton />
                <CustomGameButton
                  customModalOpen={() => {
                    close();
                    customModalOpen();
                  }}
                />
              </Group>
            </Stack>
            <Affix w="100%" position={{ bottom: 0 }}>
              <Transition
                transition="slide-up"
                mounted={opened}
                timingFunction="ease"
              >
                {(transitionStyles) => (
                  <Card
                    ref={ref}
                    p="lg"
                    bg={gray9}
                    radius="0px"
                    style={transitionStyles}
                    withBorder
                    styles={{
                      root: {
                        borderLeft: "0px",
                        borderBottom: "0px",
                        borderRight: "0px",
                      },
                    }}
                  >
                    <Group justify="center" align="center">
                      <SharePath path={path} />
                      <ShareResults
                        path={path}
                        guesses={guesses}
                        matchup={matchup}
                        matchupID={matchupID}
                        resets={resets}
                        is_custom={is_custom}
                        won={won}
                        shortestPath={minPathLength}
                      />
                    </Group>
                  </Card>
                )}
              </Transition>
            </Affix>
          </Flex>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default GameOver;
