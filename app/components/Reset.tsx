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
    gap="5px">
      <Text ta="center" size="md">Feeling stuck?</Text>
      <Button onClick={resetHandler}>Reset</Button>
    </Flex>
    
  )
}

export default Reset