import React from 'react'
import ScoreDisplay from './ScoreDisplay'
import { IconBolt } from '@tabler/icons-react'

export interface StreakDisplayProps {
    streak: number;
}

const StreakDisplay = ({streak: streak}: StreakDisplayProps) => {
    const isReturningStreak = streak >= 1
  return (
    <ScoreDisplay
        text={"Streak"}
        value={streak.toString()}
        icon={isReturningStreak && <IconBolt color="#EDD600" fill='#EDD600'/>}
        color={isReturningStreak ? "#EDD600" : undefined}
        textColor={isReturningStreak ? "#EDD600" : undefined}
    />
  )
}

export default StreakDisplay