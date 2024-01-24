import { Center, Stack, Text } from '@mantine/core';
import React, { useEffect } from 'react'
import { Chart, ReactGoogleChartContext, ReactGoogleChartEvent } from "react-google-charts";

export interface ScoreHistogramProps {
  allGuesses: number[],
  guesses: number
}

const Histogram = (props: ScoreHistogramProps) => {
  let {allGuesses, guesses} = props
  if (!allGuesses.includes(guesses)) {
    allGuesses.push(guesses)
  }

  let rawData: any = [['Name', '# Guesses'],
   ...allGuesses.map((guess) => [guess === guesses ? "Your Guess" : "", guess])]
   rawData.sort((a: any, b: any) => a[1] - b[1])

  const options = {
    legend: { position: 'none' },
    backgroundColor: 'transparent',
    histogram: { hideBucketItems:true, lastBucketPercentile: 5 },
    hAxis: {title: "# Guesses", titleTextStyle: {color: 'white'}, textStyle: {color: 'white'}, gridlines: {count: 0}},
    vAxis: {title: "Count", titleTextStyle: {color: 'white'}, textStyle: {color: 'white'}, gridlines: {count: 0}},
    colors: ['51cf66']
  }

  return (
    <Center>
       <Chart
        chartType="Histogram"
        width="600px"
        height="300px"
        data={rawData}
        options={options}
      />
   </Center>
  )
}

export default Histogram