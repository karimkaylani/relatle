import { Center, Stack, Text } from '@mantine/core';
import React from 'react'
import { Chart, ReactGoogleChartContext, ReactGoogleChartEvent } from "react-google-charts";

export interface ScoreHistogramProps {
  allGuesses: number[],
  guesses: number
}

const Histogram = (props: ScoreHistogramProps) => {
  const {allGuesses, guesses} = props
  let data = [['id', 'Guesses'],
   ...allGuesses.map((guess, i) => [i, guess])]

  const options = {
    legend: { position: "none" },
    backgroundColor: 'transparent',
    histogram: { hideBucketItems: true, lastBucketPercentile: 5 },
    colors: ['51cf66'],
    hAxis: {textStyle: {color: 'white'}, gridlines: {count: 0}},
    vAxis: {textStyle: {color: 'white'}, gridlines: {count: 0}},
  }

  return (
    <Center>
       <Chart
        chartType="Histogram"
        width="600px"
        height="300px"
        data={data}
        options={options}
      />
   </Center>
  )
}

export default Histogram