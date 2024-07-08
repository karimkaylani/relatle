import { Group } from "@mantine/core";
import React, { useEffect } from "react";
import ArtistInfo from "./ArtistInfo";
import { Artist } from "./Game";
import Arrow from "./Arrow";
import PlayButton from "./PlayButton";
import {
  isEasyMatchup,
  isMatchupDifficult,
  isRecommendedSingleMatchup,
} from "./CustomGameModal";
import { difficult_color, easy_color, gray7, green, light_green, recommended_color, red, white, yellow } from "../colors";

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
    if (isEasyMatchup(web, start.name, end.name)) {
      setBorder(easy_color);
    }
    else if (isMatchupDifficult(web, start.name, end.name)) {
      setBorder(difficult_color);
    } else if (isRecommendedSingleMatchup(web, start.name, end.name)) {
      setBorder(recommended_color);
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
