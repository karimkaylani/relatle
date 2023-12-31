import { IconPlayerPlayFilled, IconPlayerStopFilled } from '@tabler/icons-react'
import React, { Fragment } from 'react'
import HoverButton from './HoverButton'
import { Center, RingProgress } from '@mantine/core'
import { PlayingAudioContext, phoneMaxWidth } from './Game'

export interface PlayButtonProps {
    audioUrl: string
}

const PlayButton = (props: PlayButtonProps) => {
    const {audioUrl} = props
    const audioRef = React.useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [progress, setProgress] = React.useState(0)

    const {playingAudio, setPlayingAudio} = React.useContext(PlayingAudioContext)

    let isPhone = window.innerWidth < phoneMaxWidth

    const startMusic = () => {
        if (!audioRef.current) { return }
        playingAudio?.pause()
        setPlayingAudio(audioRef.current)
        audioRef.current.play()
        audioRef.current.volume = 0.5
        setIsPlaying(true)
    }

    const stopMusic = () => {
        if (!audioRef.current) { return }
        audioRef.current.pause()
        setIsPlaying(false)
        audioRef.current.currentTime = 0
        setProgress(0)
    }

    const onTimeUpdate = () => {
        if (!audioRef.current) { return }
        requestAnimationFrame(onTimeUpdate);
        setProgress(((audioRef.current.currentTime ?? 0) / audioRef.current.duration) * 100)
    }

  return (
    <Fragment>
        <HoverButton onTap={isPlaying ? stopMusic : startMusic}>
            <RingProgress thickness={2} size={isPhone ? 30 : 35} 
            sections={[{ value: progress, color: 'gray.1' }]}
            label={
                <Center>
                    {isPlaying ? 
                    <IconPlayerStopFilled size={isPhone ? 12 : 16} /> : 
                    <IconPlayerPlayFilled size={isPhone ? 12 : 16}/>}
                </Center>
            }>
            </RingProgress>
        </HoverButton>
        <audio ref={audioRef} src={audioUrl} onTimeUpdate={onTimeUpdate} onEnded={stopMusic} onPause={stopMusic}/>
    </Fragment>
  )
}

export default PlayButton