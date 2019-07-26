import React from 'react'
import { css } from '@emotion/core'

export default function EditDrawer({ open, setOpen }) {
  const drawerCss = css`
    height: ${open ? 0 : 0};
    border-top: ${open ? 'solid 1px gray' : 'none'};
  `
  return <div css={drawerCss}>drawer contents</div>
}
