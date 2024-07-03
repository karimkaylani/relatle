import React from "react";
import { Artist } from "./Game";
import { Group, Avatar, Text } from "@mantine/core";
import { green, white } from "../colors";
import PlayButton from "./PlayButton";

export interface ArtistInfoProps {
  artist: Artist;
  small: boolean;
  border?: string;
  show_name?: boolean;
  preview?: boolean;
}

const ArtistInfo = ({
  artist,
  small,
  border = undefined,
  show_name = true,
  preview = false,
}: ArtistInfoProps) => {
  return (
    <Group justify="center" gap="4px">
      <Group justify="center" gap={small ? "5px" : "xs"} wrap='nowrap'>
        <Avatar
          size={small ? "sm" : "md"}
          src={artist.image}
          alt={artist.name}
          styles={
            border
              ? {
                  image: { border: `2.5px solid ${border}`, borderRadius: "100%" },
                }
              : {}
          }
        />
        {show_name && (
          <Text
            ta="center"
            c={border ? border : white}
            size={small ? "12.5px" : "lg"}
            fw={700}
          >
            {artist.name}
          </Text>
        )}
      </Group>
      {preview && <PlayButton artist={artist} audioUrl={artist.top_song_preview_url} />}
    </Group>
  );
};

export default ArtistInfo;
