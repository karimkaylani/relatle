import React from 'react'

export interface ResetProps {
    resetHandler: () => void
}

const Reset = (props: ResetProps) => {
    const {resetHandler} = props
  return (
    <div>
        <button onClick={resetHandler}>Reset</button>
    </div>
    
  )
}

export default Reset