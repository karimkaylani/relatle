import { Button, CopyButton } from '@mantine/core'
import React from 'react'

export interface ShareCustomGameProps {
    start: string,
    end: string,
    disabled: boolean
}

export const generateCustomGameURL = (start: string, end: string): string => {
    return `https://relatle.io/custom?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`

}

const ShareCustomGame = (props: ShareCustomGameProps) => {
    const {start, end, disabled} = props
    const url = generateCustomGameURL(start, end)

    if (navigator.share) {
        return (
            <Button disabled={disabled} onClick={() => navigator.share({
                text: url
            })} variant="filled" color="green.6">SHARE GAME LINK</Button>
        )
    }

    return (
        <CopyButton value={url}>
        {({ copied, copy }) => (
            <Button disabled={disabled} color={copied ? 'green.9' : 'green.6'} onClick={copy}>
            {copied ? 'COPIED GAME LINK' : 'COPY GAME LINK'}
            </Button>
        )}
        </CopyButton>
    )
}

export default ShareCustomGame