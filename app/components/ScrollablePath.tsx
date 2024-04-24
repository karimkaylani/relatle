import { Group, ScrollArea, Text } from "@mantine/core";
import React, { Fragment } from "react";
import { Artist } from "./Game";
import ArtistInfo from "./ArtistInfo";
import Arrow from "./Arrow";
import { yellow, red } from "../colors";

export interface ScrollablePathProps {
  matchup: string[];
  web: { [key: string]: Artist };
  path: string[];
  won: boolean;
}

const ScrollablePath = (props: ScrollablePathProps) => {
  const { matchup, web, path, won } = props;
  const end = matchup[1];
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
        {path.slice(0, -1).map((artist_name, index) =>
          artist_name !== "RESET" ? (
            <Fragment key={index}>
              <ArtistInfo artist={web[artist_name]} small={true}></ArtistInfo>
              <Arrow small={true} />
            </Fragment>
          ) : (
            <Fragment key={index}>
              <Text c={yellow} size="13px" fw={500}>
                RESET
              </Text>
              <Arrow small={true} />
            </Fragment>
          )
        )}
        {won ? (
          <ArtistInfo artist={web[end]} small={true} is_green={true} />
        ) : (
          <Text c={red} size="13px" fw={500}>
            GIVE UP
          </Text>
        )}
      </Group>
    </ScrollArea>
  );
};

export default ScrollablePath;
