import React from 'react'

export interface ResetProps {
    resetHandler: () => void
}

const Reset = (props: ResetProps) => {
    const {resetHandler} = props
  return (
    <div className="mt-5">
        <button onClick={resetHandler}>Reset</button>
    </div>
    
  )
}

export default Reset