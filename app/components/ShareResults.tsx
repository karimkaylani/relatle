"use client";
import React from "react";
import { generateCustomGameURL } from "./ShareCustomGame";
import ShareButton from "./ShareButton";
import { green, dk_green } from "../colors";

export interface ShareResultsProps {
  path: string[];
  guesses: number;
  matchup: string[];
  resets: number;
  is_custom: boolean;
  matchupID: number;
  won: boolean;
  shortestPath: number;
}

const ShareResults = (props: ShareResultsProps) => {
  const { path, guesses, matchup, resets, is_custom, matchupID, won, shortestPath } = props;
  const [start, end] = matchup;

  const generateEmojiLine = (): string => {
    let res = "";
    path.slice(1).forEach((curr) => {
      if (curr == "RESET") {
        res += "🟨\n";
      } else {
        res += "⬜";
      }
    });
    res = res.slice(0, -1) + (won ? "🟩" : "🟥");
    return res;
  };
  const generateShareText = (): string => {
    const today = !is_custom ? `#${matchupID}` : "(custom)";
    let url = "https://relatle.io";
    if (is_custom) {
      url = generateCustomGameURL(start, end);
    }
    let result = "";
    if (won && guesses === shortestPath) {
      result = "Shortest Path! 🌟"
    } else if (won) {
      result = "Solved 🥳"
    } else {
      result = "Gave up 😭"
    }

    let text = `relatle ${today}
${start} → ${end}
${generateEmojiLine()}
${result}
${guesses} ${guesses === 1 ? "guess" : "guesses"}, ${resets} ${
      resets === 1 ? "reset" : "resets"
    }
${url}`;
    return text;
  };

  return (
    <ShareButton
      shareText={generateShareText()}
      buttonText="Results"
      color={green}
    />
  );
};

export default ShareResults;
