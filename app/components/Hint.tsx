"use client";

import { Button, Drawer, SimpleGrid, Text, Stack } from "@mantine/core";
import { useDisclosure, useIntersection } from "@mantine/hooks";
import { IconBulb } from "@tabler/icons-react";
import React, { Fragment, useRef } from "react";
import RelatedArtistsTitle from "./RelatedArtistsTitle";
import { Artist, PlayingAudioContext, phoneMaxWidth } from "./Game";
import ArtistCard from "./ArtistCard";
import { useSwipeable } from "react-swipeable";
import RelatleButton from "./RelatleButton";
import { gray5, gray6, gray7, gray8, gray9, white } from "../colors";

export interface HintProps {
  endArtist: Artist;
  web: { [key: string]: Artist };
  path: string[];
  setUsedHint: (usedHint: boolean) => void;
}

const Hint = (props: HintProps) => {
  const { endArtist, web, path, setUsedHint } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const { setPlayingAudio, playingAudio, setPlayingArtist, playingArtist } =
    React.useContext(PlayingAudioContext);
  const closeHint = () => {
    // If artist from hint drawer is playing on close, stop it
    if (endArtist.related.includes(playingArtist?.name ?? "")) {
      playingAudio?.pause();
      setPlayingAudio(null);
      setPlayingArtist(null);
    }
    close();
  };
  const headerSwipeHandlers = useSwipeable({
    onSwipedDown: closeHint,
  });
  const drawerSwipeHandlers = useSwipeable({
    onSwipedDown: () => {
      if (entry?.isIntersecting) {
        closeHint();
      }
    },
  });
  // Allow swipe down to close drawer from top of drawer
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 0,
  });
  return (
    <Fragment>
      <Drawer.Root
        {...drawerSwipeHandlers}
        opened={opened}
        onClose={closeHint}
        size={window.innerHeight > 900 ? "830" : "75%"}
        style={{ borderRadius: "20px" }}
        padding="sm"
        position={"bottom"}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header
            {...headerSwipeHandlers}
            style={{ top: -1 }}
            onClick={closeHint}
          >
            <Drawer.Title style={{ width: "100%" }}>
              <Stack gap="xs">
                <RelatedArtistsTitle
                  artist={endArtist}
                  won={false}
                  gameOver={false}
                  endArtist={endArtist}
                />
              </Stack>
            </Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <Stack align="center">
              <Text ref={ref} ta="center">
                <b>Note:</b>{" "}
                {
                  "These artists aren't guaranteed to be related in both directions"
                }
              </Text>
              <SimpleGrid cols={{ base: 2, xs: 3, sm: 4, md: 4, lg: 4 }}>
                {endArtist.related.map((artist_name: string) => (
                  <ArtistCard
                    key={web[artist_name].id}
                    artist={web[artist_name]}
                    path={path}
                    clickable={false}
                    gameOver={false}
                    won={false}
                    end={endArtist.name}
                    clicked={false}
                    setClicked={(_) => {}}
                    updateArtistHandler={() => {}}
                  />
                ))}
              </SimpleGrid>
            </Stack>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>

      
      <RelatleButton
        text="Hint"
        color={white} 
        icon={<IconBulb color={white} size={22}/>}
        onClick={() => {
          open();
          setUsedHint(true);
        }}
      />
    </Fragment>
  );
};

export default Hint;
