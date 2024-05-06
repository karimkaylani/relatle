"use client";
import React, { useEffect } from "react";
import { CustomGame, getLeaderboard } from "../db";
import { Artist, phoneMaxWidth } from "./Game";
import {
  Stack,
  Image,
  Group,
  Space,
  Text,
  Loader,
  Center,
} from "@mantine/core";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { green, white } from "../colors";
import GameCard from "./GameCard";
import InfiniteScroll from "react-infinite-scroll-component";

export interface LeaderboardProps {
  web: { [key: string]: Artist };
}

const Leaderboard = (props: LeaderboardProps) => {
  const { web } = props;
  const [leaderboard, setLeaderboard] = React.useState<CustomGame[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadAmount = 50;
  useEffect(() => {
    getLeaderboard(loadAmount, 1).then((leaderboard) => {
      if (leaderboard) {
        setLeaderboard(leaderboard);
      }
      setLoading(false);
    });
  }, []);

  const [width, setWidth] = React.useState(0);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const arrowWidth = width > phoneMaxWidth ? 30 : 24;

  return (
    <Stack
      align="center"
      justify="center"
      gap="lg"
      className="mt-5 pb-14 pl-5 pr-5"
    >
      <Group justify="space-between" align="center" w="100%">
        <Link href={"/"}>
          <IconArrowLeft size={arrowWidth} color={white} />
        </Link>
        <Stack justify="center" align="center" gap="0px">
          <Link href={"/"}>
            <Image
              style={{ cursor: "pointer" }}
              w={width > phoneMaxWidth ? 250 : 175}
              src="images/logo.png"
              alt="Relatle Logo"
            ></Image>
          </Link>
          <Text p="0px" c={white} ta="center">
            Custom Game Leaderboard
          </Text>
        </Stack>
        <Space w={arrowWidth} />
      </Group>
      {loading ? (
        <Loader color={green} size="md" />
      ) : leaderboard.length === 0 ? (
        <Text c={white}>No data available, please try again</Text>
      ) : (
        <InfiniteScroll
          dataLength={leaderboard.length}
          next={() =>
            getLeaderboard(loadAmount, leaderboard.length).then(
              (new_leaderboard) => {
                if (new_leaderboard) {
                  setLeaderboard(leaderboard.concat(new_leaderboard));
                }
              }
            )
          }
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            gap: "10px",
            padding: "20px",
          }}
          hasMore={leaderboard[leaderboard.length - 1].numGames >= 3}
          loader={
            <Center>
              <Loader color={green} size="md" />
            </Center>
          }
        >
          {leaderboard.map(
            (game, index) =>
              web[game.matchup[0]] &&
              web[game.matchup[1]] && (
                <GameCard
                  key={index}
                  start={web[game.matchup[0]]}
                  end={web[game.matchup[1]]}
                  plays={game.numGames}
                  avg_score={game.averageScore}
                  win_rate={game.winRate}
                />
              )
          )}
        </InfiniteScroll>
      )}
    </Stack>
  );
};

export default Leaderboard;
