import { Text } from '@mantine/core'
import React from 'react'
import { Inter } from 'next/font/google'

interface ArrowProps {
    small: boolean,
    down: boolean
}

const Arrow = (props: ArrowProps) => {
    const {small, down} = props
  return (
    <Text fw={500} c="gray.1" ta="center" className={down ? "rotate-90" : ""} size={small ? "13px" : "24px"} 
    styles={{
        root: { fontFamily: "Inter"}
    }}>→</Text>
  )
}

export default Arrow