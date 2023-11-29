import React from 'react'
import { GameOverProps } from './GameOver'
import { Button, CopyButton } from '@mantine/core'

export interface ShareProps {
    path: string[],
    guesses: number,
    matchup: string[],
    resets: number
}

const Share = (props: ShareProps) => {
    const {path, guesses, matchup, resets} = props
    const [start, end] = matchup

    const generateEmojiLine = (): string => {
        let res = ""
        path.slice(1).forEach(curr => {
            if (curr == "RESET") {
                res += "⏮️"
            } else {
                res += "⬜"
            }
        })
        res = res.slice(0, -1) + "🟩"
        return res
    }
    const generateShareText = (): string => { 
        const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
        let text = `Relatle ${today}
${start} → ${end}
${generateEmojiLine()}
Guesses: ${guesses}
Resets: ${resets}
https://relatle.vercel.app/`
        return text
    }

    if (navigator.share) {
        return (
            <Button onClick={() => navigator.share({
                text: generateShareText()
            })} size="md" variant="filled" color="teal">Share</Button>
        )
    }

    return (
        <CopyButton value={generateShareText()}>
        {({ copied, copy }) => (
            <Button color={copied ? 'blue' : 'teal'} onClick={copy}>
            {copied ? 'Copied!' : 'Share'}
            </Button>
        )}
        </CopyButton>
    )
}

export default Share