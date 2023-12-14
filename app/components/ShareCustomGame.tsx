import React from 'react'
import ShareButton from './ShareButton'

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

    return <ShareButton disabled={disabled} shareText={url} buttonText="CUSTOM GAME LINK" defaultColor="gray.7" clickedColor="gray.9"/>
}

export default ShareCustomGame