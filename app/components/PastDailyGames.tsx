"use client";
import React, { Suspense, useEffect } from "react";
import {
  Artist,
  getTodaysMatchup,
  matchupIndexPadding,
  startingDate,
} from "./Game";
import { Center, Loader } from "@mantine/core";
import { green } from "../colors";
import MainContainer from "./MainContainer";
import LeaderboardTitle from "./LeaderboardTitle";
import { useDisclosure } from "@mantine/hooks";
import CustomGameModal from "./CustomGameModal";
import { CardContainerStyles } from "./TopCustomGames";
import DailyGameGameCard from "./DailyGameCard";

export interface PastDailyGamesProps {
  web: { [key: string]: Artist };
  matchups: string[][];
}

const PastDailyGames = ({ web, matchups: localMatchups }: PastDailyGamesProps) => {
  const [matchups, setMatchups] = React.useState(localMatchups)
  const [loading, setLoading] = React.useState(true);

  const [customModalOpened, customModalHandlers] = useDisclosure(false);
  const { open } = customModalHandlers;
  const [todayMatchupID, setTodayMatchupID] = React.useState<number>(-1);

  // Ensure newest matchup data
  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let today = getTodaysMatchup(matchups)[1];
    setTodayMatchupID(today);
    setLoading(false);
  }, [matchups]);

  const [width, setWidth] = React.useState(-1);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDate = (matchup_id: number) => {
    let date = new Date(startingDate);
    date.setDate(date.getDate() + matchup_id - 1);
    // format day as Tuesday, May 14 2024
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  if (loading)
    return (
      <Center className="pt-14">
        <Loader size="lg" color={green} />
      </Center>
    );

  const gameAmount = 30;
  let pastMatchups: string[][] = []
  for (let i = todayMatchupID - 1; i > todayMatchupID - gameAmount - 1; i--) {
    let index = (i - matchupIndexPadding - 1) % matchups.length
    pastMatchups.push(matchups[index])
  }

  return (
    <>
      <MainContainer>
        <LeaderboardTitle title="Past Daily Games" openCustomModal={open} />
        <div style={CardContainerStyles as React.CSSProperties}>
          {pastMatchups
            .map(
              (matchup, index) =>
                web[matchup[0]] &&
                web[matchup[1]] && (
                  <DailyGameGameCard
                    web={web}
                    start={web[matchup[0]]}
                    end={web[matchup[1]]}
                    matchupID={
                      todayMatchupID - index - 1
                    }
                    date={getDate(todayMatchupID - index - 1)}
                    key={index}
                  />
                )
            )}
        </div>
      </MainContainer>
      <Suspense>
        <CustomGameModal
          customModalOpened={customModalOpened}
          customModalHandlers={customModalHandlers}
          web={web}
          matchups={matchups}
        />
      </Suspense>
    </>
  );
};

export default PastDailyGames;
