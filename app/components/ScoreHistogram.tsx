import { Center, Stack, Text } from '@mantine/core';
import React, { useEffect } from 'react'
import { Chart, ReactGoogleChartContext, ReactGoogleChartEvent } from "react-google-charts";

export interface ScoreHistogramProps {
  allGuesses: number[],
  guesses: number
}

const Histogram = (props: ScoreHistogramProps) => {
  let {allGuesses, guesses} = props
  const [chartReady, setChartReady] = React.useState(false);
  if (!allGuesses.includes(guesses)) {
    allGuesses.push(guesses)
  }

  let rawData: any = [['Name', '# Guesses'],
   ...allGuesses.map((guess) => [guess === guesses ? "Your Guess" : "", guess])]
   rawData.sort((a: any, b: any) => a[1] - b[1])

  const options = {
    legend: { position: 'none' },
    backgroundColor: 'transparent',
    histogram: { hideBucketItems:false, lastBucketPercentile: 5 },
    hAxis: {title: "# Guesses", titleTextStyle: {color: 'white'}, textStyle: {color: 'white'}, gridlines: {count: 0}},
    vAxis: {title: "Count", titleTextStyle: {color: 'white'}, textStyle: {color: 'white'}, gridlines: {count: 0}},
    colors: ['51cf66']
  }

  useEffect(() => {
    let desiredIndex = rawData.findIndex((row: any) => row[0] === "Your Guess") + 1
    let container = document.getElementById('reactgooglegraph-1');
    if (container) {
      const rects = container.getElementsByTagName('rect')
      rects[desiredIndex].setAttribute('fill', '#51cf66')
    }
  }, [setChartReady])

  const readyEvent: ReactGoogleChartEvent = {
    eventName: "ready",
    callback: ({ chartWrapper, google }) => {
      setChartReady(true);
      let desiredIndex = rawData.findIndex((row: any) => row[0] === "Your Guess") + 1

      let container = document.getElementById('reactgooglegraph-1');
      let observer = new MutationObserver(function () {
        const rects = container?.getElementsByTagName('rect') ?? []
        rects[desiredIndex].setAttribute('fill', '#51cf66')
      })
      if (container) {
        observer.observe(container, {
          childList: true,
          subtree: true,
        });
      }
    },  
  };

  return (
    <Center>
       <Chart
        chartType="Histogram"
        width="600px"
        height="300px"
        data={rawData}
        // chartEvents={[readyEvent]}
        options={options}
      />
   </Center>
  )
}

export default Histogram