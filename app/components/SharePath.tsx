import { Button, CopyButton } from '@mantine/core'
import React from 'react'
import ShareButton from './ShareButton'

export interface SharePathProps {
    path: string[]
}

const SharePath = (props: SharePathProps) => {
    const {path} = props
    const pathString = path.join("→")

    return <ShareButton shareText={pathString} buttonText="PATH" defaultColor="gray.7" clickedColor="gray.9"/>
}

export default SharePath