import { Button, CopyButton } from '@mantine/core'
import { IconCopy, IconShare2 } from '@tabler/icons-react'
import React from 'react'

export interface ShareButtonProps {
    shareText: string,
    disabled?: boolean
    buttonText: string
    defaultColor: string,
    clickedColor: string 
}

const ShareButton = ({disabled = false, shareText, buttonText, defaultColor, clickedColor}: ShareButtonProps) => {

    if (navigator.share) {
        return (
            <Button disabled={disabled} onClick={() => navigator.share({
                text: shareText
            })} variant="filled" color={defaultColor} leftSection={<IconShare2 size={20}/>} 
            styles={{ section: {marginRight: "4px", marginBottom: "4px"}}}>
                SHARE {buttonText.toLocaleUpperCase()}
            </Button>
        )
    }

    return (
        <CopyButton value={shareText}>
        {({ copied, copy }) => (
            <Button disabled={disabled} color={copied ? clickedColor : defaultColor} onClick={copy} leftSection={<IconCopy size={20}
            />} styles={{ section: {marginRight: "4px"}}}
            >
            {copied ? `COPIED ${buttonText.toLocaleUpperCase()}` : `COPY ${buttonText.toLocaleUpperCase()}`}
            </Button>
        )}
        </CopyButton>
    )
}

export default ShareButton