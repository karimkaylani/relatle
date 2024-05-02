import { Group, ScrollArea, Text } from "@mantine/core";
import React, { Fragment } from "react";
import { Artist } from "./Game";
import ArtistInfo from "./ArtistInfo";
import Arrow from "./Arrow";
import { yellow, red, white } from "../colors";

export interface ScrollablePathProps {
  matchup: string[];
  web: { [key: string]: Artist };
  path: string[];
}

const ScrollablePath = (props: ScrollablePathProps) => {
  const { matchup, web, path } = props;
  const end = matchup[1];
  if (path.length <= 1) {
    return <Text c={white}>No path yet! Make some guesses and come back</Text>;
  }
  return (
    <ScrollArea
      className="pl-5 pr-5"
      type="scroll"
      offsetScrollbars
      scrollbarSize={6}
      styles={{
        viewport: { maxHeight: 155, maxWidth: 500 },
      }}
    >
      <Group justify="flex-start" gap="xs">
        {path.map((artist_name, index) => (
          <Fragment key={index}>
            {artist_name === "RESET" ? (
              <Text c={yellow} size="sm" fw={700}>
                RESET
              </Text>
            ) : artist_name == "GIVE UP" ? (
              <Text c={red} size="sm" fw={700}>
                GIVE UP
              </Text>
            ) : (
              <ArtistInfo
                artist={web[artist_name]}
                is_green={artist_name === end}
                small={true}
              />
            )}
            {index <= path.length - 2 && <Arrow small={true} />}
          </Fragment>
        ))}
      </Group>
    </ScrollArea>
  );
};

export default ScrollablePath;
