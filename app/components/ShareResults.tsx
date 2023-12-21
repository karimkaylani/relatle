'use client'
import React from 'react'
import { generateCustomGameURL } from './ShareCustomGame'
import ShareButton from './ShareButton'

export interface ShareResultsProps {
    path: string[],
    guesses: number,
    matchup: string[],
    resets: number,
    is_custom: boolean,
    matchupID: number
}

const ShareResults = (props: ShareResultsProps) => {
    const {path, guesses, matchup, resets, is_custom, matchupID} = props
    const [start, end] = matchup

    const generateEmojiLine = (): string => {
        let res = ""
        path.slice(1).forEach(curr => {
            if (curr == "RESET") {
                res += "🟨\n"
            } else {
                res += "⬜"
            }
        })
        res = res.slice(0, -1) + "🟩"
        return res
    }
    const generateShareText = (): string => { 
        const today = !is_custom ? `#${matchupID}` : "(custom)"
        let url = "https://relatle.io"
        if (is_custom) {
            url = generateCustomGameURL(start, end)
        }
    
        let text = `relatle ${today}
${start} → ${end}
${generateEmojiLine()}
Guesses: ${guesses}
Resets: ${resets}
${url}`
        return text
    }

    return <ShareButton shareText={generateShareText()} buttonText="RESULTS" defaultColor="green.6" clickedColor="green.9"/>
}

export default ShareResults