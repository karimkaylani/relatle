import {
  Text,
  Modal,
  Stack,
  Autocomplete,
  Card,
  Group,
  Button,
  Image,
  CloseButton,
} from "@mantine/core";
import React, { use, useEffect, useRef, useState } from "react";
import { Artist, maxButtonGrowWidth } from "./Game";
import Arrow from "./Arrow";
import * as Collections from "typescript-collections";
import ShareCustomGame, { generateCustomGameURL } from "./ShareCustomGame";
import { IconArrowsShuffle, IconPlayerPlayFilled } from "@tabler/icons-react";
import HoverButton from "./HoverButton";
import ArtistInfo from "./ArtistInfo";
import { useSearchParams } from "next/navigation";
import IconHoverButton from "./IconHoverButton";
import CustomIcon from "./CustomIcon";
import { white, yellow, green, dk_green } from "../colors";
import RelatleButton from "./RelatleButton";

interface CustomGameModalProps {
  web: { [key: string]: Artist };
  customModalOpened: boolean;
  customModalHandlers: any;
  matchups: string[][];
}

/* From a starting artist, return a hashmap where the keys are endArtists
 and the values are the paths from the starting artist to the end artist */
const getNumPathsEndArtists = (
  web: { [key: string]: Artist },
  start: string,
  maxSteps: number = Infinity
): { [key: string]: string[][] } => {
  const visited: Set<string> = new Set();
  const queue: Collections.Queue<[string, string[]]> = new Collections.Queue();
  queue.enqueue([start, []]);
  const endArtists: { [key: string]: string[][] } = {};

  while (!queue.isEmpty()) {
    const item = queue.dequeue();
    if (item === undefined) {
      return endArtists;
    }
    const [node, path] = item;
    visited.add(node);
    if (path.length <= maxSteps) {
      if (node !== start) {
        if (endArtists[node] === undefined) {
          endArtists[node] = [path];
        } else {
          endArtists[node].push(path);
        }
      }
      for (const neighbor of web[node].related || []) {
        if (!visited.has(neighbor)) {
          queue.enqueue([neighbor, [...path, neighbor]]);
        }
      }
    }
  }
  return endArtists;
};

export function getValidPaths(
  web: { [key: string]: Artist },
  start: string,
  end: string,
  maxSteps: number
): string[][] {
  const visited: Set<string> = new Set();
  const queue: Collections.Queue<[string, number, string[]]> =
    new Collections.Queue();
  queue.enqueue([start, 0, []]);
  const paths: string[][] = [];

  while (!queue.isEmpty()) {
    const item = queue.dequeue();
    if (item === undefined) {
      return paths;
    }
    const [node, steps, path] = item;
    visited.add(node);
    if (steps <= maxSteps) {
      if (node === end) {
        paths.push(path);
      }
    }
    for (const neighbor of web[node].related || []) {
      if (!visited.has(neighbor)) {
        queue.enqueue([neighbor, steps + 1, path.concat(neighbor)]);
      }
    }
  }
  return paths;
}

const getConnectedNodes = (
  graph: { [key: string]: Artist },
  start: string
): string[] => {
  const visited: Set<string> = new Set();
  const result: string[] = [];

  const dfs = (node: string) => {
    if (!visited.has(node)) {
      visited.add(node);
      if (node !== start) {
        result.push(node);
      }
      for (const neighbor of graph[node].related || []) {
        dfs(neighbor);
      }
    }
  };
  dfs(start);
  return result;
};

const minDegOfSepRecommended = 3;
const maxDegOfSepRecommended = 7;
const maxDegOfSepWarning = 10;
const maxNumPathsForWarning = 4;
const minNumPathsForRecommended = 10;
const maxNumPathsForRecommended = Infinity;

const CustomGameModal = (props: CustomGameModalProps) => {
  const { web, customModalOpened, customModalHandlers, matchups } = props;
  const { close: customModalClose } = customModalHandlers;
  const artistsList: string[] = [...Object.keys(web)];
  const [matchupsFound, setMatchupsFound] = useState<string[]>([]);
  const [startArtist, setStartArtist] = useState<string>("");
  const [endArtist, setEndArtist] = useState<string>("");
  const [recommendedEndArtists, setRecommendedEndArtists] = useState<string[]>(
    []
  );
  const searchParams = useSearchParams();

  const invalidMatchup = !(
    artistsList.includes(startArtist) && matchupsFound.includes(endArtist)
  );

  const changeStartArtist = (start: string) => {
    setStartArtist(start);
    if (artistsList.includes(start)) {
      selectStartArtist(start);
    }
    if (!artistsList.includes(endArtist)) {
      setEndArtist("");
    }
  };

  const repeatingArtistInAllPaths = (
    paths: string[][],
    start: string,
    ignoreFirstClick: boolean
  ): boolean => {
    if (ignoreFirstClick) {
      paths = paths.map((path) => path.slice(1));
    }
    let all_artists_in_paths = new Set(paths.flat());
    for (const artist of all_artists_in_paths) {
      if (
        paths.filter((path) => path.slice(0, -1).includes(artist)).length ===
        paths.length
      ) {
        return true;
      }
    }
    return false;
  };

  const atLeastTwoPathsIfNumFirstClicked = (
    paths: string[][],
    amount: number
  ): boolean => {
    const startingArtists = new Set(paths.map((x) => x[0]));
    if (startingArtists.size === amount) {
      for (const artist of startingArtists) {
        if (paths.filter((path) => path[0] === artist).length < amount) {
          return false;
        }
      }
    }
    return true;
  };

  const targetArtistRelatedBothDirections = (
    end: string,
    percentage: number
  ): boolean => {
    return (
      web[end].related.filter(
        (artist) =>
          web[end].related.includes(artist) && web[artist].related.includes(end)
      ).length /
        web[end].related.length >=
      percentage
    );
  };

  const isRecommendedMatchup = (
    start: string,
    end: string,
    closeEndArtists: string[],
    endArtistsWithMaxDegOfSep: { [key: string]: string[][] }
  ): boolean => {
    /* Conditions:
        1. Must have at least minNumPathsForRecommended paths
        2. Must have at most maxNumPathsForRecommended paths
        3. Must not be a close end artist (path length within minDegOfSepRecommended)
        4. There isn't any single artist that appears in all paths
        5. If there are only 2 first clicked artists, then must be at least 2 paths for each
        6. Target artist must be related in both directions to at 30% of their related artists
        */
    return (
      endArtistsWithMaxDegOfSep[end].length >= minNumPathsForRecommended &&
      endArtistsWithMaxDegOfSep[end].length <= maxNumPathsForRecommended &&
      !closeEndArtists.includes(end) &&
      !repeatingArtistInAllPaths(
        endArtistsWithMaxDegOfSep[end],
        start,
        web[start].related.length === 1
      ) &&
      atLeastTwoPathsIfNumFirstClicked(endArtistsWithMaxDegOfSep[end], 2) &&
      targetArtistRelatedBothDirections(end, 0.3)
    );
  };

  const getRecommendedArtists = (start: string) => {
    const closeEndArtists = Object.keys(
      getNumPathsEndArtists(web, start, minDegOfSepRecommended)
    );
    const endArtistsWithMaxDegOfSep = getNumPathsEndArtists(
      web,
      start,
      maxDegOfSepRecommended
    );
    let recommendedEndArtists = Object.keys(endArtistsWithMaxDegOfSep).filter(
      (artist) =>
        isRecommendedMatchup(
          start,
          artist,
          closeEndArtists,
          endArtistsWithMaxDegOfSep
        )
    );

    // For daily matchup curating: don't want to reuse target artists
    if (searchParams.get("curating") && matchups !== null) {
      // Get list of second artist of last 30 matchups
      const secondArtists = matchups
        .slice(matchups.length - 30)
        .map((matchup) => matchup[1]);
      // Filter out artists that are second artists in any matchup
      recommendedEndArtists = recommendedEndArtists.filter(
        (artist) => !secondArtists.includes(artist)
      );
    }
    return recommendedEndArtists;
  };

  const selectStartArtist = (start: string) => {
    if (!artistsList.includes(start)) {
      return;
    }
    const endArtists = getConnectedNodes(web, start);
    setMatchupsFound(endArtists);
    const recommendedEndArtists = getRecommendedArtists(start);
    setRecommendedEndArtists(recommendedEndArtists);
    setStartArtist(start);
    if (!endArtists.includes(endArtist) || !artistsList.includes(endArtist)) {
      setEndArtist("");
    }
  };

  const closeModal = () => {
    customModalClose();
    setStartArtist("");
    setEndArtist("");
    setMatchupsFound([]);
  };

  const getRandomMatchup = () => {
    const start = artistsList[Math.floor(Math.random() * artistsList.length)];
    const validEndArtsits = getConnectedNodes(web, start);
    const end =
      validEndArtsits[Math.floor(Math.random() * validEndArtsits.length)];
    selectStartArtist(start);
    setEndArtist(end);
  };

  const getRandomRecommendedMatchup = () => {
    let found = false;
    while (!found) {
      const start = artistsList[Math.floor(Math.random() * artistsList.length)];
      const recommendedEndArtists = getRecommendedArtists(start);
      if (recommendedEndArtists.length > 0) {
        const end =
          recommendedEndArtists[
            Math.floor(Math.random() * recommendedEndArtists.length)
          ];
        selectStartArtist(start);
        setEndArtist(end);
        found = true;
      }
    }
  };

  const getRandomRecommendedFixedStart = () => {
    if (recommendedEndArtists.length == 1) {
      setEndArtist(recommendedEndArtists[0]);
      return;
    }
    let filtered = recommendedEndArtists.filter(
      (artist) => artist !== endArtist
    );
    let newEnd = filtered[Math.floor(Math.random() * filtered.length)];
    setEndArtist(newEnd);
  };

  const getRandomFixedStart = () => {
    if (matchupsFound.length == 1) {
      setEndArtist(matchupsFound[0]);
      return;
    }
    let filtered = matchupsFound.filter((artist) => artist !== endArtist);
    let newEnd = filtered[Math.floor(Math.random() * filtered.length)];
    setEndArtist(newEnd);
  };

  const isCurrentMatchupDifficult = () => {
    if (
      startArtist === "" ||
      endArtist === "" ||
      !artistsList.includes(startArtist) ||
      !matchupsFound.includes(endArtist)
    ) {
      return false;
    }
    const validPaths = getValidPaths(
      web,
      startArtist,
      endArtist,
      maxDegOfSepWarning
    );
    return (
      (artistsList.includes(startArtist) &&
        matchupsFound.includes(endArtist) &&
        validPaths.length < maxNumPathsForWarning &&
        getValidPaths(web, startArtist, endArtist, minDegOfSepRecommended)
          .length <= 0) ||
      repeatingArtistInAllPaths(validPaths, startArtist, true)
    );
  };

  const isCurrentMatchupEasy = () => {
    return (web[startArtist]?.related.includes(endArtist));
  }

  const isCurrentMatchupRecommended = () => {
    return endArtist !== "" && recommendedEndArtists.includes(endArtist);
  };

  const getArtistOrder = () => {
    let res: { [key: string]: number } = {};
    // loop with index
    for (let i = 0; i < artistsList.length; i++) {
      res[artistsList[i]] = i;
    }
    return res;
  };

  const artistRanking = getArtistOrder();

  const compareArtists = (a: string, b: string) => {
    // sort based on order of keys in web
    return artistRanking[a] - artistRanking[b];
  };

  const removeArticles = (title: string) => {
    let words = title.split(" ");
    if (words.length <= 1) {
      return title;
    }
    if (words[0] == "a" || words[0] == "the" || words[0] == "an")
      return words.splice(1).join(" ");
    return title;
  };

  return (
    <Modal
      opened={customModalOpened}
      onClose={closeModal}
      withCloseButton={true}
      centered
      padding="lg"
      radius="lg"
      title="Create a Custom Game"
      styles={{
        title: {
          fontSize: "20px",
          color: white,
          fontWeight: 700,
          lineHeight: "32px",
        },
        header: {
          paddingBottom: "8px",
        },
      }}
    >
      <Stack>
        <Text>
          Play your own custom matchup and send the link to challenge your
          friends.
        </Text>
        <Group align="center" justify="center">
          <IconHoverButton
            onTap={getRandomRecommendedMatchup}
            icon={<CustomIcon />}
            text="Recommended"
            textSize="sm"
          />
          <IconHoverButton
            onTap={getRandomMatchup}
            icon={<IconArrowsShuffle size={16} color={white} />}
            text="Random"
            textSize="sm"
          />
        </Group>
        <Autocomplete
          size="lg"
          radius="md"
          placeholder="Starting artist"
          data={artistsList}
          onChange={changeStartArtist}
          selectFirstOptionOnChange={true}
          spellCheck="false"
          styles={{
            input: { color: white, fontSize: "16px" },
            dropdown: { color: white },
            option: { fontSize: "14px" },
          }}
          value={startArtist}
          leftSection={
            web[startArtist] !== undefined && (
              <ArtistInfo
                artist={web[startArtist]}
                small={true}
                show_name={false}
              />
            )
          }
          rightSection={
            <Group
              gap="xs"
              justify="flex-end"
              align="center"
              style={{ width: "100%" }}
            >
              <CloseButton
                aria-label="Clear input"
                onClick={() => setStartArtist("")}
                style={{
                  display: startArtist ? undefined : "none",
                  marginLeft: "-6px",
                }}
              />
            </Group>
          }
        />
        <Arrow small={false} down={true} />
        <Stack gap="xs">
          <Autocomplete
            size="lg"
            radius="md"
            placeholder="Target artist"
            disabled={
              !artistsList.includes(startArtist) || matchupsFound.length == 0
            }
            data={[
              {
                group: "Recommended Target Artists",
                items: recommendedEndArtists.sort(compareArtists),
              },
              {
                group: "Target Artists",
                items: matchupsFound
                  .filter((artist) => !recommendedEndArtists.includes(artist))
                  .sort(compareArtists),
              },
            ]}
            styles={{
              input: {
                color: white,
                fontSize: "16px",
                outline: isCurrentMatchupDifficult()  || isCurrentMatchupEasy()
                  ? `2px solid ${yellow}`
                  : isCurrentMatchupRecommended()
                  ? `2px solid ${green}`
                  : "",
              },
              groupLabel: {
                color: green,
                fontWeight: 700,
                fontSize: "14px",
              },
              dropdown: { color: white },
              option: { fontSize: "14px" },
            }}
            onChange={setEndArtist}
            selectFirstOptionOnChange={true}
            spellCheck="false"
            value={endArtist}
            leftSection={
              web[endArtist] !== undefined &&
              matchupsFound.includes(endArtist) && (
                <ArtistInfo
                  artist={web[endArtist]}
                  small={true}
                  is_green={true}
                  show_name={false}
                />
              )
            }
            rightSectionWidth={91}
            rightSection={
              artistsList.includes(startArtist) && (
                <Group
                  gap="12px"
                  justify="flex-end"
                  align="center"
                  style={{ width: "100%" }}
                >
                  {(recommendedEndArtists.length > 1 ||
                    (recommendedEndArtists.length == 1 &&
                      endArtist !== recommendedEndArtists[0])) && (
                    <HoverButton onTap={getRandomRecommendedFixedStart}>
                      <CustomIcon label={"New Random Recommended End Artist"} />
                    </HoverButton>
                  )}
                  <HoverButton onTap={getRandomFixedStart}>
                    <IconArrowsShuffle
                      size={18}
                      color="white"
                      aria-label="New Random End Artist"
                    />
                  </HoverButton>
                  <CloseButton
                    aria-label="Clear input"
                    onClick={() => setEndArtist("")}
                    style={{
                      opacity: endArtist ? 100 : 0,
                      marginLeft: "-6px",
                      cursor: endArtist ? "pointer" : "default",
                    }}
                  />
                </Group>
              )
            }
          />

          {isCurrentMatchupDifficult() || isCurrentMatchupEasy() ? (
            <Text pl="5" pb="14" ta="left" fw={700} c={yellow} size="md">
              {isCurrentMatchupDifficult() ? "Warning, this matchup may be difficult!" :  "This matchup is really easy!"}
            </Text>
          ) : isCurrentMatchupRecommended() ? (
            <Text pl="5" pb="14" ta="left" fw={700} c={green} size="md">
              This is a recommended matchup!
            </Text>
          ) : (
            <Text pl="5" ta="left" fw={700} size="sm">
              If you don&apos;t see your desired target artist, the matchup is
              impossible.
            </Text>
          )}
        </Stack>

        <Group
          w="100%"
          justify="center"
          align="center"
          grow={window.innerWidth > maxButtonGrowWidth}
        >
          <ShareCustomGame
            start={startArtist}
            end={endArtist}
            disabled={invalidMatchup}
          />
          <RelatleButton
            text="Play"
            color={green}
            onClick={() =>
              window.open(
                generateCustomGameURL(startArtist, endArtist),
                window.matchMedia("(display-mode: standalone)").matches
                  ? "_self"
                  : "_blank"
              )
            }
            disabled={invalidMatchup}
            icon={<IconPlayerPlayFilled size={20} />}
          />
        </Group>
      </Stack>
    </Modal>
  );
};

export default CustomGameModal;
