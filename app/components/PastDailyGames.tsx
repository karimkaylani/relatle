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

const PastDailyGames = ({ web, matchups }: PastDailyGamesProps) => {
  const [loading, setLoading] = React.useState(false);

  const [customModalOpened, customModalHandlers] = useDisclosure(false);
  const { open } = customModalHandlers;
  const [todayMatchup, setTodayMatchup] = React.useState<number>(-1);

  useEffect(() => {
    let today = getTodaysMatchup(matchups)[1];
    console.log(today - matchupIndexPadding);
    setTodayMatchup(today - matchupIndexPadding);
    setLoading(true);
  }, []);

  const [width, setWidth] = React.useState(-1);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDate = (index: number) => {
    let date = new Date(startingDate);
    date.setDate(date.getDate() + index + matchupIndexPadding);
    // format day as Tuesday, May 14 2024
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  if (!loading)
    return (
      <Center className="pt-14">
        <Loader size="lg" color={green} />
      </Center>
    );

  const gameAmount = 30;
  const startIndex = matchups.length - todayMatchup + 1;
  const endIndex = startIndex + gameAmount;
  return (
    <>
      <MainContainer>
        <LeaderboardTitle title="Past Daily Games" openCustomModal={open} />
        <div style={CardContainerStyles as React.CSSProperties}>
          {matchups
            .slice(startIndex, endIndex)
            .map(
              (matchup, index) =>
                web[matchup[0]] &&
                web[matchup[1]] && (
                  <DailyGameGameCard
                    start={web[matchup[0]]}
                    end={web[matchup[1]]}
                    matchupID={
                      matchups.length - index - startIndex + matchupIndexPadding
                    }
                    date={getDate(matchups.length - index - startIndex - 1)}
                    key={index + startIndex}
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
