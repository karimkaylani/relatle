"use client";
import React, { Suspense, useEffect } from "react";
import { CustomGame, getLeaderboard } from "../db";
import { Artist, maxCustomTextWidth, phoneMaxWidth } from "./Game";
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
import HoverButton from "./HoverButton";
import CustomGameButton from "./CustomGameButton";
import { useDisclosure } from "@mantine/hooks";
import RelatleButton from "./RelatleButton";
import CustomIcon from "./CustomIcon";
import CustomGameModal from "./CustomGameModal";
import SortButtons from "./SortButtons";
import Logo from "./Logo";
import LeaderboardTitle from "./LeaderboardTitle";
import MainContainer from "./MainContainer";

export interface TopCustomGamesProps {
  web: { [key: string]: Artist };
}

export enum SortParameter {
  numGames = "Plays",
  averageScore = "Avg Score",
  winRate = "Win Rate",
}

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

export const CardContainerStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  alignContent: "center",
  gap: "10px",
  paddingTop: "2px",
  paddingLeft: "15px",
  paddingRight: '15px',
}


const TopCustomGames = (props: TopCustomGamesProps) => {
  const { web } = props;
  const [topGames, setTopGames] = React.useState<CustomGame[]>([]);
  const [leaderboard, setLeaderboard] = React.useState<CustomGame[]>([]);
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const [sortParameter, setSortParameter] = React.useState<SortParameter>(
    SortParameter.numGames
  );
  const [sortOrder, setSortOrder] = React.useState<SortOrder>(SortOrder.desc);

  const [customModalOpened, customModalHandlers] = useDisclosure(false);
  const { open } = customModalHandlers;

  const loadAmount = 25;
  const totalAmount = 100;
  useEffect(() => {
    setMounted(true);
    getLeaderboard().then((leaderboard) => {
      if (leaderboard) {
        setTopGames(leaderboard);
        let currLeaderboard = leaderboard.slice(0, loadAmount);
        setLeaderboard(currLeaderboard);
      }
      setLoading(false);
    });
  }, []);

  const sortLeaderboard = (
    parameter: SortParameter,
    order: SortOrder
  ) => {
    setSortParameter(parameter);
    setSortOrder(order);
    let sortedLeaderboard = [...topGames];
    if (parameter === SortParameter.numGames) {
      sortedLeaderboard.sort((a, b) => {
        return order === SortOrder.asc
          ? a.numGames - b.numGames
          : b.numGames - a.numGames;
      });
    } else if (parameter === SortParameter.averageScore) {
      sortedLeaderboard.sort((a, b) => {
        return order === SortOrder.asc
          ? a.averageScore - b.averageScore
          : b.averageScore - a.averageScore;
      });
    } else if (parameter === SortParameter.winRate) {
      sortedLeaderboard.sort((a, b) => {
        return order === SortOrder.asc ? a.winRate - b.winRate : b.winRate - a.winRate;
      });
    }
    setTopGames(sortedLeaderboard);
    setLeaderboard(sortedLeaderboard.slice(0, loadAmount));
  };

  const [width, setWidth] = React.useState(0);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (mounted === false) {
    return (
      <Center className="pt-14">
        <Loader size="lg" color={green} />
      </Center>
    );
  }

  return (
    <>
      <MainContainer>
        <LeaderboardTitle title='Top Custom Games' openCustomModal={open}/>
        {loading ? (
          <Loader color={green} size="md" />
        ) : leaderboard.length === 0 ? (
          <Text c={white}>No data available, please try again</Text>
        ) : (
          <>
            <SortButtons
              sortOrder={sortOrder}
              sortParameter={sortParameter}
              sort={sortLeaderboard}
            />
            <InfiniteScroll
              dataLength={leaderboard.length}
              next={() => {
                setLeaderboard(
                  leaderboard.concat(
                    topGames.slice(
                      leaderboard.length,
                      leaderboard.length + loadAmount
                    )
                  )
                );
              }}
              style={CardContainerStyles as React.CSSProperties}
              hasMore={leaderboard.length < topGames.length}
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
                      index={index + 1}
                    />
                  )
              )}
            </InfiniteScroll>
          </>
        )}
      </MainContainer>
      <Suspense>
        <CustomGameModal
          customModalOpened={customModalOpened}
          customModalHandlers={customModalHandlers}
          web={web}
          matchups={[]}
        />
      </Suspense>
    </>
  );
};

export default TopCustomGames;
