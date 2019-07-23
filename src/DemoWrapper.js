import React, { useState } from 'react'
import { Global, css } from '@emotion/core'
import DemoOptions from './DemoOptions'
import PropsDrawer from './PropsDrawer'
import useLocalStorage from './useLocalStorage'

const styles = {
  wrapper: css`
    padding: 12px;
    width: fit-content;
  `,
  demoContainer: css`
    display: flex;
  `,
  contents: css`
    flex-grow: 1;
  `,
  global: css`
    body {
      margin: 0;
    }
    .demo-font {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
        'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `,
}

export default function DemoWrapper({
  propObjects,
  displayName,
  children,
  propStates,
  setPropStates,
}) {
  const [open, setOpen] = useLocalStorage('propsDrawerOpen', true)
  const [width, setWidth] = useLocalStorage('propsDrawerWidth', 400)

  const contentCss = css`
    /* flex-grow: 1; */
    /* margin-left: ${open ? `${width + 4}px` : 0}; */
    display: flex;
    width: 100%;
  `

  const Children = <div css={styles.wrapper}>{children}</div>
  return (
    <div css={styles.demoContainer}>
      <Global styles={styles.global} />
      <main css={contentCss}>
        {/* PROPS DRAWER */}
        <PropsDrawer
          propStates={propStates}
          setPropStates={setPropStates}
          open={open}
          setOpen={setOpen}
          displayName={displayName}
          propObjects={propObjects}
          width={width}
          setWidth={setWidth}
        />

        <div css={styles.contents}>
          {/* DEMO OPTIONS */}
          <DemoOptions open={open} setOpen={setOpen} />

          {/* DEMO COMPONENT */}
          {Children}
        </div>
      </main>
    </div>
  )
}
