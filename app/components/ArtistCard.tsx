import React, { Fragment, useEffect, useRef, useState } from "react";
import { Artist, PlayingAudioContext, phoneMaxWidth } from "./Game";
import {
  Card,
  Text,
  Flex,
  BackgroundImage,
  RingProgress,
  Center,
  Transition,
  Overlay,
} from "@mantine/core";
import { motion, useAnimate } from "framer-motion";
import { useLongPress } from "use-long-press";
import waveAnimation from "../audioWave.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface ArtistCardProps {
  artist: Artist;
  updateArtistHandler: (artist: Artist) => void;
  path: string[];
  won: boolean;
  end: string;
  clicked: boolean;
  setClicked: (clicked: boolean) => void;
  clickable?: boolean;
}

const ArtistCard = ({
  artist,
  updateArtistHandler,
  path,
  won,
  end,
  clicked,
  setClicked,
  clickable = true,
}: ArtistCardProps) => {
  let img_size = window.innerWidth > phoneMaxWidth ? 175 : 140;
  let text_size = window.innerWidth > phoneMaxWidth ? "md" : "sm";

  const [scope, animate] = useAnimate();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isLongPress, setLongPress] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const [resetAudioTimer, setResetAudioTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const isPlayingRef = useRef(isPlaying);

  const { playingAudio, setPlayingAudio, setPlayingArtist } =
    React.useContext(PlayingAudioContext);

  // To get up-to-date value of isPlaying in resetAudioTimer
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const startMusic = () => {
    if (!audioRef.current) {
      return;
    }
    playingAudio?.pause();
    setPlayingAudio(audioRef.current);
    setPlayingArtist(artist);
    audioRef.current.volume = 0.5;
    setIsPlaying(true);
    resetAudioTimer && clearTimeout(resetAudioTimer);
    setResetAudioTimer(null);
  };

  const stopMusic = () => {
    if (!audioRef.current) {
      return;
    }
    // only set to null if the audio being paused is the one currently playing
    if (playingAudio === audioRef.current) {
      setPlayingAudio(null);
      setPlayingArtist(null);
    }
    setIsPlaying(false);
    // Reset audio after set time if audio hasn't been played again
    setResetAudioTimer(
      setTimeout(() => {
        if (audioRef.current && !isPlayingRef.current) {
          audioRef.current.currentTime = 0;
          setProgress(0);
        }
      }, 5000)
    );
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (resetAudioTimer) {
        clearTimeout(resetAudioTimer);
      }
    };
  }, [resetAudioTimer]);

  const onTimeUpdate = () => {
    if (!audioRef.current) {
      return;
    }
    requestAnimationFrame(onTimeUpdate);
    setProgress(
      ((audioRef.current.currentTime ?? 0) / audioRef.current.duration) * 100
    );
  };

  const bind = useLongPress(
    () => {
      audioRef.current?.play();
      setLongPress(true);
    },
    {
      onFinish: () => {
        audioRef.current?.pause();
      },
      onCancel: () => {
        audioRef.current?.pause();
        setLongPress(false);
      },
    }
  );

  const clickArtistHandler = () => {
    if (clicked || isLongPress) {
      return;
    }
    if (won) {
      return updateArtistHandler(artist);
    }
    setClicked(true);
    setLongPress(false);
    const winningGuess = artist.name === end;
    const borderSize = winningGuess ? "4px" : "2px";
    const borderColor = winningGuess ? "#51cf66" : "#f1f3f5";
    animate(
      [
        [
          scope.current,
          { border: `${borderSize} solid ${borderColor}` },
          { duration: 0.3 },
        ],
        [
          scope.current,
          { border: `${borderSize} solid ${borderColor}` },
          { duration: winningGuess ? 0.6 : 0.3 },
        ],
      ],
      {
        ease: "linear",
        onComplete: () => {
          updateArtistHandler(artist);
          animate([
            [
              scope.current,
              { border: `0px solid ${borderColor}` },
              { duration: 0.3 },
            ],
          ]);
        },
      }
    );
  };

  return (
    <motion.button
      {...bind()}
      whileHover={
        clickable
          ? window.innerWidth > phoneMaxWidth
            ? { scale: 1.05 }
            : { scale: 1.03 }
          : {}
      }
      whileTap={{ scale: 0.95 }}
      onTap={clickable ? clickArtistHandler : () => null}
      onTouchEnd={() => setLongPress(false)}
      onMouseUp={() => setLongPress(false)}
      onTouchCancel={() => setLongPress(false)}
      onTapCancel={() => setLongPress(false)}
    >
      <Card
        ref={scope}
        shadow="sm"
        radius="md"
        withBorder
        padding="xs"
        opacity={won && artist.name !== end ? 0.25 : 1}
        styles={{
          root: {
            width:
              window.innerWidth > phoneMaxWidth
                ? "192px"
                : window.innerWidth > 345
                ? "160px"
                : "",
            userSelect: "none",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
          },
        }}
      >
        <Flex align="center" direction="column" justify="center" gap="0px">
          <Card.Section inheritPadding>
            <BackgroundImage
              draggable={false}
              radius="sm"
              src={artist.image}
              w={img_size}
              h={img_size}
              styles={{
                root: {
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  WebkitTouchCallout: "none",
                },
              }}
            >
              <Center
                className={window.innerWidth > phoneMaxWidth ? "pt-8" : "pt-3"}
              >
                <Transition
                  mounted={isPlaying}
                  transition="fade"
                  duration={400}
                  timingFunction="ease"
                >
                  {(styles) => (
                    <Fragment>
                      <Overlay style={styles} backgroundOpacity={0.5} />
                      <RingProgress
                        thickness={5}
                        style={styles}
                        styles={{ root: { zIndex: 1000 } }}
                        sections={[{ value: progress, color: "gray.1" }]}
                        label={
                          <Center>
                            <Lottie
                              animationData={waveAnimation}
                              style={{ width: 50 }}
                            />
                          </Center>
                        }
                      />
                    </Fragment>
                  )}
                </Transition>
              </Center>
            </BackgroundImage>
          </Card.Section>
          <Text
            c={
              path.includes(artist.name) && artist.name !== end
                ? "gray.5"
                : "gray.1"
            }
            fw={700}
            size={text_size}
            mt="md"
            ta="center"
            styles={{ root: { userSelect: "none", WebkitUserSelect: "none" } }}
          >
            {artist.name}
          </Text>
        </Flex>
        <audio
          loop
          ref={audioRef}
          src={artist.top_song_preview_url}
          onTimeUpdate={onTimeUpdate}
          onPlay={startMusic}
          onPause={stopMusic}
        />
      </Card>
    </motion.button>
  );
};

export default ArtistCard;
