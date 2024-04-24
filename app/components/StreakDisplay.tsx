import React from 'react'
import ScoreDisplay from './ScoreDisplay'
import { IconBolt } from '@tabler/icons-react'
import { yellow } from '../colors';

export interface StreakDisplayProps {
    streak: number;
}

const StreakDisplay = ({streak: streak}: StreakDisplayProps) => {
    const isReturningStreak = streak >= 1
  return (
    <ScoreDisplay
        text={"Streak"}
        value={streak.toString()}
        icon={isReturningStreak && <IconBolt color={yellow} fill={yellow} stroke={1}/>}
        color={isReturningStreak ? yellow : undefined}
        textColor={isReturningStreak ? yellow : undefined}
    />
  )
}

export default StreakDisplay