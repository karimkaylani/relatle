"use client";
import React, { Fragment } from "react";
import { Artist, PlayingAudioContext, phoneMaxWidth } from "./Game";
import {
  Affix,
  Avatar,
  Box,
  Card,
  Center,
  Group,
  Text,
  Transition,
} from "@mantine/core";
import ArtistInfo from "./ArtistInfo";
import Arrow from "./Arrow";
import { green, white } from "../colors";

export interface AffixStatusProps {
  currArtist: Artist;
  endArtist: Artist;
  guesses: number;
  resets: number;
  scrolled: boolean | undefined;
  onTap: () => void;
  gameOver: boolean;
  sideDrawerOpened: boolean;
}

const AffixStatus = (props: AffixStatusProps) => {
  const { currArtist, endArtist, guesses, resets, scrolled, onTap, gameOver, sideDrawerOpened } = props;
  const groupRef = React.useRef<HTMLDivElement>(null);

  const { playingAudio, playingArtist } = React.useContext(PlayingAudioContext);
  const mounted = !sideDrawerOpened && ((scrolled === true && !gameOver) || playingAudio !== null);

  return (
    <Affix w="100%" h={0} top={0} zIndex={201}>
      <Transition transition="slide-down" mounted={mounted}>
        {(transitionStyles) => (
          <Card
            onClick={onTap}
            ref={groupRef}
            p={playingAudio ? '3px' : '9px'}
            withBorder
            styles={{ root: { maxHeight: "130px", overflow: "auto" } }}
            style={transitionStyles}
          >
            {playingAudio && playingArtist && (
              <Text ta="center" fw={700} styles={{root: {marginBottom: '7px'}}}>
                Playing{" "}
                <Avatar
                  radius="sm"
                  size={"sm"}
                  src={playingArtist.top_song_art}
                  alt={playingArtist.top_song_name + "art"}
                  style={{
                    display: "inline-block",
                    top: "7px",
                    marginLeft: "3px",
                    marginRight: "5px",
                  }}
                />
                <Text fw={700} c={green} span>
                  {playingArtist.top_song_name}
                </Text>{" "}
                by{" "}
                <Center style={{ display: "inline-block" }}>
                  <Avatar
                    size={"sm"}
                    src={playingArtist?.image}
                    alt={playingArtist?.name}
                    style={{
                      display: "inline-block",
                      top: "7px",
                      marginLeft: "3px",
                      marginRight: "5px",
                    }}
                  />
                  <Text
                    ta="center"
                    fw={700}
                    c={white}
                    style={{ display: "inline-block" }}
                  >
                    {playingArtist?.name}
                  </Text>
                </Center>
              </Text>
            )}

            {!playingAudio && scrolled && !gameOver && (
              <Group align="center" justify="space-between" wrap="nowrap">
                <Group align="center" justify="center" gap="xs" wrap="nowrap">
                  <ArtistInfo artist={currArtist} small={true} />
                  <Arrow small={true} />
                  <ArtistInfo artist={endArtist} small={true} border={green} />
                </Group>
                <Text>
                  {guesses} | {resets}
                </Text>
              </Group>
            )}
          </Card>
        )}
      </Transition>
    </Affix>
  );
};

export default AffixStatus;
