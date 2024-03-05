"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
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
} from "@mantine/core";
import ShareResults from "./ShareResults";
import { Artist, phoneMaxWidth } from "./Game";
import ScrollablePath from "./ScrollablePath";
import Scoreboard, { ScoreDisplay } from "./Scoreboard";
import SharePath from "./SharePath";
import * as Collections from "typescript-collections";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Matchup from "./Matchup";
import { useSwipeable } from "react-swipeable";
import CountdownClock from "./CountdownClock";
import CustomGameButton from "./CustomGameButton";
import GlobalScoreStats from "./GlobalScoreStats";
import { getCachedGuesses } from "../db";

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
  streak: number;
  longest_streak: number;
  days_played: number;
}

const getMinPath = (
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
  streak,
  longest_streak,
  days_played,
}: GameOverProps) => {
  const [start, end] = matchup;
  const [minPathOpened, { open: openMinPath, close: closeMinPath, toggle: toggleMinPath }] = useDisclosure(false);

  const headerSwipeHandlers = useSwipeable({
    onSwipedDown: close,
  });

  const minPath = getMinPath(web, start, end);
  const minPathLength = minPath.length;
  minPath.unshift(start);

  const [allGuesses, setAllGuesses] = useState<number[]>([]);

  const [loadingGlobalScore, setLoadingGlobalScore] = useState<boolean>(true);

  useEffect(() => {
    if (!opened || !loadingGlobalScore) {
      return;
    }
    if (is_custom) {
      setLoadingGlobalScore(false);
      return;
    }
    getCachedGuesses(matchupID).then((res) => {
      if (res !== null) {
        setAllGuesses(res);
      }
      setLoadingGlobalScore(false);
    });
  }, [opened, is_custom, loadingGlobalScore, matchupID]);

  // Auto open min path if won
  useEffect(() => {
    if (!won) {
      openMinPath();
    } else {
      closeMinPath();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  const [height, setHeight] = useState(77);
  const ref = useRef<HTMLDivElement>(null);

  const handleResize = () => setHeight(ref.current?.clientHeight ?? 77);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Drawer.Root
      opened={opened}
      onClose={close}
      size={window.innerWidth > phoneMaxWidth ? "80%" : "85%"}
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
            <Text ta="center" c="gray.1" size="xl" fw={700}>
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
            styles={{ root: { marginBottom: height } }}
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
            />
            <Text ta="center" fw={700} size="sm">
              Your Path
            </Text>
            <ScrollablePath matchup={matchup} web={web} path={path} won={won} />

            <Group align="center" justify="center" gap="sm">
              <Text fw={700} size="sm" ta="center">
                {won && guesses === minPathLength
                  ? `Congrats! The shortest path was ${minPathLength} guesses long`
                  : `Shortest Path: ${minPathLength} guesses`}
              </Text>
              {(!won || guesses !== minPathLength) && (
                <Button
                  leftSection={
                    minPathOpened ? (
                      <IconArrowUp size={15} />
                    ) : (
                      <IconArrowDown size={15} />
                    )
                  }
                  color="gray.9"
                  size="xs"
                  styles={{ section: { marginRight: "4px" } }}
                  onClick={toggleMinPath}
                >
                  {minPathOpened ? "HIDE" : "VIEW"}
                </Button>
              )}
            </Group>
            <Collapse in={minPathOpened}>
              <ScrollablePath
                matchup={matchup}
                web={web}
                path={minPath}
                won={true}
              ></ScrollablePath>
            </Collapse>

            {!is_custom &&
              (loadingGlobalScore ? (
                <Loader color="green.6" size="sm" />
              ) : (
                <GlobalScoreStats
                  won={won}
                  guesses={guesses}
                  allGuesses={allGuesses}
                />
              ))}

            {!is_custom && (
              <Fragment>
                <Text ta="center" fw={700} size="sm">
                  Your Stats
                </Text>
                <Card shadow="lg" radius="lg" p="xs">
                  <Group align="center" justify="center">
                    {ScoreDisplay("Streak", streak.toString(), true)}
                    <Divider orientation="vertical" />
                    {ScoreDisplay(
                      "Longest Streak",
                      longest_streak.toString(),
                      true
                    )}
                    <Divider orientation="vertical" />
                    {ScoreDisplay("Games Won", days_played.toString(), true)}
                  </Group>
                </Card>
              </Fragment>
            )}
            {!is_custom && <CountdownClock />}
            {is_custom && (
              <Stack gap="xs" align="center" className="pt-5">
                <Text fw={700} size="md">
                  Play another!
                </Text>
                <CustomGameButton
                  customModalOpen={() => {
                    close();
                    customModalOpen();
                  }}
                />
              </Stack>
            )}
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
                    bg="#1a1b1e"
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
