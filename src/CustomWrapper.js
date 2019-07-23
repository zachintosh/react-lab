import React from 'react'
import Root from '@fs/zion-root'

export default function CustomWrapper({ children }) {
  return (
    <Root header={false} footer={false}>
      {children}
    </Root>
  )
}
