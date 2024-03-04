import React from 'react'

export interface GiveUpProps {
    onClick: () => void
}

const GiveUpButton = (props: GiveUpProps) => {
    const { onClick } = props
  return (
    <div onClick={onClick}>GiveUpButton</div>
  )
}

export default GiveUpButton