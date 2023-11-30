import { Button, Flex, Text } from '@mantine/core'
import React from 'react'

export interface ResetProps {
    resetHandler: () => void
}

const Reset = (props: ResetProps) => {
    const {resetHandler} = props
  return (
    <Flex
    align="center"
    direction="column"
    gap="5px"
    className="pb-10">
      <Text ta="center" size="md">Feeling stuck?</Text>
      <Button onClick={resetHandler} size="md" variant="filled">Reset</Button>
    </Flex>
    
  )
}

export default Reset