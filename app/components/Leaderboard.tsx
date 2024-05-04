"use client";
import React, { useEffect } from "react";
import { CustomGame, getLeaderboard } from "../db";
import { Artist } from "./Game";

export interface LeaderboardProps {
  web: { [key: string]: Artist };
}

const Leaderboard = (props: LeaderboardProps) => {
  const { web } = props;
  const [leaderboard, setLeaderboard] = React.useState<CustomGame[]>([]);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    getLeaderboard().then((leaderboard) => {
      if (leaderboard) {
        setLeaderboard(leaderboard);
      }
      setLoading(false);
    });
  }, []);
  return <div>Leaderboard</div>;
};

export default Leaderboard;
