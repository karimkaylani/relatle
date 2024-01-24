import { Stack, Text } from '@mantine/core'
import React, { Fragment } from 'react'
import GlobalScoreSlider from './GlobalScoreSlider'

export interface GlobalScoreStatsProps {
    guesses: number,
    allGuesses: number[]
    
}

const GlobalScoreStats = (props: GlobalScoreStatsProps) => {
    const {guesses, allGuesses} = props
    const avgGuesses = allGuesses.reduce((a, b) => a + b, 0) / allGuesses.length
    const minGuesses = Math.min(...allGuesses)
    const roundedAvgGuesses = Math.round(avgGuesses)
  return (
    <Stack gap='xl' align='center' justify='center'>
        <Text fw={700} ta='center' size='sm'>{"Today's Global Results"}</Text>
        {allGuesses.length < 3 ?
        <Text ta='center' size='sm' c='gray.1'>Come back soon for global results</Text> : 
        <Fragment>
            <GlobalScoreSlider guesses={guesses} avgGuesses={roundedAvgGuesses} minGuesses={minGuesses}/>
            <Text ta='center' size='sm'>These values will update as more games are completed</Text>
        </Fragment>
        }

    </Stack>
  )
}

export default GlobalScoreStats