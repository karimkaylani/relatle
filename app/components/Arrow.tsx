import React from 'react'
import { IconArrowRight, IconArrowDown } from '@tabler/icons-react'

interface ArrowProps {
    small: boolean,
    down?: boolean
}

const Arrow = ({small, down = false}: ArrowProps) => {
  let size = small ? "12px" : "21px"
  return (
    down ? <IconArrowDown className="self-center" size={size} /> : <IconArrowRight size={size} />
  )
}

export default Arrow