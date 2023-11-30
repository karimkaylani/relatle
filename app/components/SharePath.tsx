import { Button, CopyButton } from '@mantine/core'
import React from 'react'

export interface SharePathProps {
    path: string[]
}

const SharePath = (props: SharePathProps) => {
    const {path} = props
    const pathString = path.join("→")

    if (navigator.share) {
        return (
            <Button onClick={() => navigator.share({
                text: pathString
            })} variant="filled" color="gray.7">SHARE RESULTS</Button>
        )
    }

    return (
        <CopyButton value={pathString}>
        {({ copied, copy }) => (
            <Button color={copied ? 'gray.9' : 'gray.7'} onClick={copy}>
            {copied ? 'COPIED PATH' : 'SHARE PATH'}
            </Button>
        )}
        </CopyButton>
    )
}

export default SharePath