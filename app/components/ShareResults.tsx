import React from 'react'
import { GameOverProps } from './GameOver'
import { Button, CopyButton } from '@mantine/core'
import { getDiffInDays } from './Game'

export interface ShareResultsProps {
    path: string[],
    guesses: number,
    matchup: string[],
    resets: number
}

const ShareResults = (props: ShareResultsProps) => {
    const {path, guesses, matchup, resets} = props
    const [start, end] = matchup

    const generateEmojiLine = (): string => {
        let res = ""
        path.slice(1).forEach(curr => {
            if (curr == "RESET") {
                res += "🟨"
            } else {
                res += "⬜"
            }
        })
        res = res.slice(0, -1) + "🟩"
        return res
    }
    const generateShareText = (): string => { 
        const today = getDiffInDays()
        let text = `Relatle #${today}
${start} → ${end}
${generateEmojiLine()}
Guesses: ${guesses}
Resets: ${resets}
https://relatle.io`
        return text
    }

    if (navigator.share) {
        return (
            <Button onClick={() => navigator.share({
                text: generateShareText()
            })} color="green.6">SHARE RESULTS</Button>
        )
    }

    return (
        <CopyButton value={generateShareText()}>
        {({ copied, copy }) => (
            <Button color={copied ? 'green.9' : 'green.6'} onClick={copy}>
            {copied ? 'COPIED RESULTS' : 'SHARE RESULTS'}
            </Button>
        )}
        </CopyButton>
    )
}

export default ShareResults