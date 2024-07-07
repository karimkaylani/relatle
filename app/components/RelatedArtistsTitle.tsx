import React from "react";
import { Artist, phoneMaxWidth } from "./Game";
import { Group, Stack, Text } from "@mantine/core";
import ArtistInfo from "./ArtistInfo";
import { green } from "../colors";

export interface RelatedArtistsTitleProps {
  artist: Artist;
  won: boolean;
  endArtist: Artist;
  gameOver: boolean;
}

const RelatedArtistsTitle = React.forwardRef<
  HTMLDivElement,
  RelatedArtistsTitleProps
>((props, ref) => {
  const { artist, won, endArtist, gameOver } = props;
  let small = window.innerWidth <= phoneMaxWidth;

  if (won || gameOver) {
    return (
      <Stack align="center" gap="xs">
        <Text size={small ? "sm" : "md"}>
          Tap the scoreboard to view your results
        </Text>
        {won && (
          <Group justify="center" gap="xs">
            <Text size={small ? "md" : "lg"}>You found</Text>
            <ArtistInfo artist={endArtist} small={small} />
          </Group>
        )}
      </Stack>
    );
  }

  return (
    <Group align="center" ref={ref} justify="center" gap="6px">
      <ArtistInfo
        artist={artist}
        small={small}
        border={artist.name === endArtist.name ? green : undefined}
      />
      <Text size={small ? "md" : "lg"}>related artists</Text>
    </Group>
  );
});
RelatedArtistsTitle.displayName = "RelatedArtistsTitle";

export default RelatedArtistsTitle;
