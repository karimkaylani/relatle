import { Group } from "@mantine/core";
import React, { useEffect } from "react";
import ArtistInfo from "./ArtistInfo";
import { Artist } from "./Game";
import Arrow from "./Arrow";
import PlayButton from "./PlayButton";
import {
  isMatchupDifficult,
  isRecommendedSingleMatchup,
} from "./CustomGameModal";
import { green, white, yellow } from "../colors";

export interface MatchupProps {
  web: { [key: string]: Artist };
  start: Artist;
  end: Artist;
  small: boolean;
  showPreviews?: boolean;
  center?: boolean;
}

const Matchup = React.forwardRef<HTMLDivElement, MatchupProps>((props, ref) => {
  const { web, start, end, small, showPreviews = false, center = true } = props;
  const [border, setBorder] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    if (isMatchupDifficult(web, start.name, end.name)) {
      setBorder(yellow);
    } else if (isRecommendedSingleMatchup(web, start.name, end.name)) {
      setBorder(green);
    } else {
      setBorder(white);
    }
  }, [start, end, web]);

  return (
    <Group ref={ref} gap="xs" justify={center ? "center" : undefined}>
      <ArtistInfo artist={start} small={small} preview={showPreviews} />
      <Arrow small={small} />
      <ArtistInfo
        artist={end}
        small={small}
        border={border}
        preview={showPreviews}
      />
    </Group>
  );
});
Matchup.displayName = "Matchup";

export default Matchup;
