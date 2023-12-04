import React from 'react'
import ShareButton from './ShareButton'

export interface SharePathProps {
    path: string[]
}

const SharePath = (props: SharePathProps) => {
    const {path} = props
    let pathString = path[0] + " "

    path.slice(1).forEach((curr) => {
        pathString += "→ "
        if (curr == "RESET") {
            pathString += "RESET\n"
        } else {
            
            pathString += (curr + " ")
        }
    })

    return <ShareButton shareText={pathString} buttonText="PATH" defaultColor="gray.7" clickedColor="gray.9"/>
}

export default SharePath