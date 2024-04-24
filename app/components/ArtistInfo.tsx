import React from "react";
import { Artist } from "./Game";
import { Group, Avatar, Text } from "@mantine/core";
import { green, white } from "../colors";

export interface ArtistInfoProps {
  artist: Artist;
  small: boolean;
  is_green?: boolean;
  show_name?: boolean;
}

const ArtistInfo = ({
  artist,
  small,
  is_green = false,
  show_name = true,
}: ArtistInfoProps) => {
  return (
    <Group justify="center" gap={small ? "5px" : "xs"}>
      <Avatar
        size={small ? "sm" : "md"}
        src={artist.image}
        alt={artist.name}
        styles={
          is_green
            ? {
                image: { border: `2.5px solid ${green}`, borderRadius: "100%" },
              }
            : {}
        }
      />
      {show_name && (
        <Text
          ta="center"
          c={is_green ? green : white}
          size={small ? "12.5px" : "lg"}
          fw={700}
        >
          {artist.name}
        </Text>
      )}
    </Group>
  );
};

export default ArtistInfo;
