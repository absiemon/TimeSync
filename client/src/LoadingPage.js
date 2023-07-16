import { Spin } from 'antd'
import React from 'react'

function LoadingPage() {
  return (
    <div style={{display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', height:'100vh'}}>
        <Spin style={{height:'26px', width:'26px'}}/>
        <h1>SuperDolphin</h1>
    </div>
  )
}

export default LoadingPage