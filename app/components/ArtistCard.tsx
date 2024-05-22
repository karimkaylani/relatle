import React, { Fragment, useEffect, useRef, useState } from "react";
import { Artist, PlayingAudioContext, phoneMaxWidth } from "./Game";
import {
  Card,
  Text,
  Flex,
  BackgroundImage,
  Image,
  RingProgress,
  Center,
  Transition,
  Overlay,
  CardSection,
  Box,
} from "@mantine/core";
import { motion, useAnimate } from "framer-motion";
import { useLongPress } from "use-long-press";
import waveAnimation from "../audioWave.json";
import dynamic from "next/dynamic";
import { gray9, green, gray5, white } from "../colors";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface ArtistCardProps {
  artist: Artist;
  updateArtistHandler: (artist: Artist) => void;
  path: string[];
  won: boolean;
  gameOver: boolean;
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
  gameOver,
  end,
  clicked,
  setClicked,
  clickable = true,
}: ArtistCardProps) => {
  let img_size = window.innerWidth > phoneMaxWidth ? 175 : 140;
  let text_size = window.innerWidth > phoneMaxWidth ? "md" : "sm";

  const [scope, animate] = useAnimate();
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const [resetAudioTimer, setResetAudioTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const isPlayingRef = useRef(isPlaying);

  const longPressThreshold = 400;

  const { playingAudio, setPlayingAudio, setPlayingArtist } =
    React.useContext(PlayingAudioContext);

  /* Long press support for keyboard */
  // So keyDown doesn't fire multiple times
  const [isHoldingKey, setIsHoldingKey] = useState(false);
  const [keyHoldTimer, setKeyHoldTimer] = useState<NodeJS.Timeout | undefined>(
    undefined
  );

  const fallbackSrc = `https://ui-avatars.com/api/?background=${gray9.slice(1)}&color=${white.slice(1)}&name=${encodeURIComponent(
    artist.name.replace(/[^A-Z0-9]/gi, "")
  )}`;

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // If tabbing away from artist card, treat like letting go of long press
    if (event.key === "Tab") {
      audioRef.current?.pause();
      return;
    }
    // If hitting escape key on artist card in hint, stop music since hint drawer is being closed
    // Note: Hint drawer is the only place where non-clickable artist cards are found
    if (!clickable && event.key === "Escape") {
      audioRef.current?.pause();
      return;
    }
    if (isHoldingKey) return;
    if (event.key === "Enter") {
      setIsHoldingKey(true);
      setKeyHoldTimer(
        setTimeout(() => {
          audioRef.current?.play();
        }, longPressThreshold)
      );
    }
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      if (isHoldingKey && !isPlaying) {
        clickFunction();
      }
      audioRef.current?.pause();
    }
    clearTimeout(keyHoldTimer);
    setIsHoldingKey(false);
  };

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

  // Stop music when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audioRef.current?.pause();
        setKeyHoldTimer(undefined);
        setIsHoldingKey(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
    },
    {
      onFinish: () => {
        audioRef.current?.pause();
      },
      onCancel: () => {
        audioRef.current?.pause();
      },
      threshold: longPressThreshold,
    }
  );

  const clickArtistHandler = () => {
    /* If music is playing, don't follow through with click because
       that means this is a long press. Just stop the music. */
    if (clicked || isPlaying) {
      audioRef.current?.pause();
      return;
    }
    if (gameOver) {
      return updateArtistHandler(artist);
    }
    setClicked(true);
    const winningGuess = artist.name === end;
    const borderSize = winningGuess ? "4px" : "2px";
    const borderColor = winningGuess ? green : white;
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
  const clickFunction = clickable ? clickArtistHandler : () => audioRef.current?.pause()

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
      // This triggers for tap, click, and enter key
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    >
      <Card
        onClick={clickFunction}
        ref={scope}
        shadow="sm"
        radius="md"
        withBorder
        padding="xs"
        opacity={gameOver && artist.name !== end ? 0.25 : 1}
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
            msUserSelect: "none",
            MozUserSelect: "none",
          },
        }}
      >
        <Flex align="center" direction="column" justify="center" gap="xs">
          <Box style={{ position: "relative" }}>
            <Image
              draggable={false}
              radius="sm"
              src={artist.image}
              fallbackSrc={fallbackSrc}
              w={img_size}
              h={img_size}
              alt={artist.name}
              styles={{
                root: {
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  WebkitTouchCallout: "none",
                },
              }}
            />
            <Center
              styles={{
                root: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                },
              }}
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
                      sections={[{ value: progress, color: white }]}
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
          </Box>
          <Text
            c={
              path.includes(artist.name) && artist.name !== end
                ? {light_gray: gray5}
                : white
            }
            fw={700}
            size={text_size}
            ta="center"
            styles={{ root: { userSelect: "none", WebkitUserSelect: "none" } }}
          >
            {artist.name}
          </Text>
        </Flex>
        <audio
          preload="none"
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
