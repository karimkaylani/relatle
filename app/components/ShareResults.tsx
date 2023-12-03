'use client'
import React from 'react'
import { Button, CopyButton } from '@mantine/core'
import { usePathname, useSearchParams } from 'next/navigation'

export interface ShareResultsProps {
    path: string[],
    guesses: number,
    matchup: string[],
    resets: number,
    is_custom: boolean
}

const ShareResults = (props: ShareResultsProps) => {
    const {path, guesses, matchup, resets, is_custom} = props
    const [start, end] = matchup
    const pathname = usePathname()
    const searchParams = useSearchParams()

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
        const today = !is_custom ? new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }) : "(Custom)"
        let url = "https://relatle.io"
        if (is_custom) {
            const [start, end] = [searchParams.get('start'), searchParams.get('end')]
            url = url + `${pathname}?start=${encodeURIComponent(start ?? "")}&end=${encodeURIComponent(end ?? "")}`
        }
    
        let text = `Relatle ${today}
${start} → ${end}
${generateEmojiLine()}
Guesses: ${guesses}
Resets: ${resets}
${url}`
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