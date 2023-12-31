import { Box, Card, Flex, Group, Loader, Paper, Space, Stack, Text } from '@mantine/core'
import React, { Fragment, useEffect, useState } from 'react'

interface CircleProps {
    color: string,
    value: number,
    showValue: boolean
}   

export interface GlobalScoreSliderProps {
    avgGuesses: number,
    minGuesses: number,
    guesses: number,
    loading: boolean
}

const GlobalScoreSlider = (props: GlobalScoreSliderProps) => {
    let {avgGuesses, minGuesses, guesses, loading} = props
    const range = [Math.min(avgGuesses, minGuesses, guesses), Math.max(avgGuesses, minGuesses, guesses)]

    const [width, setWidth] = useState(0)
    const maxWidth = 410
    const widthPadding = 80
    const handleResize = () => setWidth(window.innerWidth > maxWidth+widthPadding ? maxWidth : window.innerWidth - widthPadding)
    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const Circle = (props: CircleProps) => {
        const {color, value, showValue} = props
        const rangeSize = range[1] - range[0]
        const circleSize = 20
        const padding = ((value - range[0]) / rangeSize) * width
        return (
                <Paper bg={color} radius='xl' w={circleSize+12}
                styles={{root: {marginBottom: -32, marginLeft: -15, left: padding, position: 'relative', zIndex: showValue ? 1000 : 1,
                border: '6px solid #495057', borderRadius: '70%'}}}>
                    <Space h={circleSize}></Space>
                </Paper>
        )
    }
    if (guesses < minGuesses) {
        minGuesses = guesses
    }
    let scores: [string, number, string][] = 
    [['Min. Guesses', minGuesses, 'gray.1'], ['Your Score', guesses, 'green.6'], ['Avg. Guesses', avgGuesses, 'yellow.5']]
    scores.sort((a, b) => a[1] - b[1]);

    if (!loading && avgGuesses === -1) {
        return (
            <Stack>
                <Text ta='center' size='sm'>{"Today's Global Results"}</Text>
                <Text ta='center' size='sm' c='gray.1'>Come back soon for global results</Text>
            </Stack>
        )
    }
    let yourScoreColor = 'green.6'
    if (guesses === minGuesses) {
        yourScoreColor = 'linear-gradient(to right, #f1f3f5 10px, #40c057 10px'
    }
    else if (guesses === avgGuesses) {
        yourScoreColor = 'linear-gradient(to right, #40c057 10px, #fcc419 10px'
    }
  return (
    <Stack gap='xl' align='center' justify='center'>
        <Text fw={700} ta='center' size='sm'>{"Today's Global Results"}</Text>
        {loading && <Loader color="green.6" size='sm' />}

        {!loading &&  
            <Fragment>
                <div style={{margin: 0, padding: 0}}>
                        <Paper bg='gray.7' w={width} radius='xl' className='-mb-5'>
                            <Space h={10}/>
                        </Paper>
                        <Circle color='gray.1' value={minGuesses} showValue={false}/>
                        <Circle color='yellow.5' value={avgGuesses} showValue={false}/>
                        <Circle color={yourScoreColor} value={guesses} showValue={true}/>
                </div>
                <Stack>
                    <Group justify='center' align='center' gap='xs'>
                        {scores.map(([label, score, color], index) =>
                            <Fragment key={label}>
                            <Text fw={700} size='sm' c={color} >{label}: {score}</Text>
                            {index !== scores.length - 1 && <Text fw={700} size='sm' c='gray.7' >|</Text>}
                            </Fragment> 
                        )}
                    </Group>
                    <Text ta='center' size='sm'>These values will update as more games are completed</Text>
                </Stack>
            </Fragment>
        }
    </Stack>
  )
}

export default GlobalScoreSlider