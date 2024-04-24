import {
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
} from "@tabler/icons-react";
import React, { Fragment } from "react";
import HoverButton from "./HoverButton";
import { Center, RingProgress } from "@mantine/core";
import { Artist, PlayingAudioContext, phoneMaxWidth } from "./Game";
import { white } from "../colors";

export interface PlayButtonProps {
  audioUrl: string;
  artist: Artist;
}

const PlayButton = (props: PlayButtonProps) => {
  const { audioUrl, artist } = props;
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const { playingAudio, setPlayingAudio, setPlayingArtist } =
    React.useContext(PlayingAudioContext);

  let isPhone = window.innerWidth < phoneMaxWidth;

  const startMusic = () => {
    if (!audioRef.current) {
      return;
    }
    playingAudio?.pause();
    setPlayingAudio(audioRef.current);
    setPlayingArtist(artist);
    audioRef.current.volume = 0.5;
    setIsPlaying(true);
  };

  const stopMusic = () => {
    if (!audioRef.current) {
      return;
    }
    setIsPlaying(false);
    // only set to null if the audio being paused is the one currently playing
    if (playingAudio === audioRef.current) {
      setPlayingAudio(null);
      setPlayingArtist(null);
    }
    audioRef.current.currentTime = 0;
    setProgress(0);
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) {
      return;
    }
    requestAnimationFrame(onTimeUpdate);
    setProgress(
      ((audioRef.current.currentTime ?? 0) / audioRef.current.duration) * 100
    );
  };

  return (
    <Fragment>
      <HoverButton
        onTap={() => {
          isPlaying ? audioRef.current?.pause() : audioRef.current?.play();
        }}
      >
        <RingProgress
          thickness={2}
          size={isPhone ? 30 : 35}
          sections={[{ value: progress, color: white }]}
          label={
            <Center>
              {isPlaying ? (
                <IconPlayerStopFilled aria-label={`Stop preview of ${artist.name}`} size={isPhone ? 12 : 16} />
              ) : (
                <IconPlayerPlayFilled aria-label={`Play preview of ${artist.name}`} size={isPhone ? 12 : 16} />
              )}
            </Center>
          }
        ></RingProgress>
      </HoverButton>
      <audio
        preload="none"
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={onTimeUpdate}
        onPlay={startMusic}
        onEnded={stopMusic}
        onPause={stopMusic}
      />
    </Fragment>
  );
};

export default PlayButton;
