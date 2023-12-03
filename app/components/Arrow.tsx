import { Text } from '@mantine/core'
import React from 'react'
import { Inter } from 'next/font/google'

interface ArrowProps {
    small: boolean
}

const inter = Inter({ subsets: ['latin'] })

const Arrow = (props: ArrowProps) => {
    const {small} = props
  return (
    <Text fw={500} c="gray.1" size={small ? "13px" : "24px"} 
    styles={{
        root: { fontFamily: "Inter"}
    }}>→</Text>
  )
}

export default Arrow