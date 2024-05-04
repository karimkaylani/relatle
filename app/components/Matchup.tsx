import { Group } from "@mantine/core";
import React from "react";
import ArtistInfo from "./ArtistInfo";
import { Artist } from "./Game";
import Arrow from "./Arrow";
import PlayButton from "./PlayButton";

export interface MatchupProps {
  start: Artist;
  end: Artist;
  small: boolean;
  showPreviews?: boolean;
}

const Matchup = React.forwardRef<HTMLDivElement, MatchupProps>((props, ref) => {
  const { start, end, small, showPreviews = false } = props;

  return (
    <Group ref={ref} gap="xs">
      <ArtistInfo artist={start} small={small} preview={showPreviews} />
      <Arrow small={small} />
      <ArtistInfo artist={end} small={small} is_green={true} preview={showPreviews}/>
    </Group>
  );
});
Matchup.displayName = "Matchup";

export default Matchup;
