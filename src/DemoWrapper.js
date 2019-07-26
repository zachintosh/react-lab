import React from 'react'
import { Global, css } from '@emotion/core'
import DemoOptions from './DemoOptions'
import PropsDrawer from './PropsDrawer'
import useLocalStorage from './useLocalStorage'
import EditDrawer from './EditDrawer'

const styles = {
  wrapper: css`
    padding: 12px;
    width: fit-content;
  `,
  main: css`
    display: flex;
    width: 100%;
    overflow-y: scroll;
    /* flex-grow: 1; */
  `,
  demoContainer: css`
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    /* grid-template-rows: minmax(min-content, 100vh) 10vh; */
    max-height: 100vh;
    overflow: hidden;
  `,
  contents: css`
    overflow-y: hidden;
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
  const [propsDrawerOpen, setPropsDrawerOpen] = useLocalStorage('propsDrawerOpen', true)
  const [editDrawerOpen, setEditDrawerOpen] = useLocalStorage('editDrawerOpen', true)
  const [width, setWidth] = useLocalStorage('propsDrawerWidth', 400)

  return (
    <>
      <Global styles={styles.global} />
      <div css={styles.demoContainer}>
        <main css={styles.main}>
          {/* PROPS DRAWER */}
          <PropsDrawer
            propStates={propStates}
            setPropStates={setPropStates}
            open={propsDrawerOpen}
            setOpen={setPropsDrawerOpen}
            displayName={displayName}
            propObjects={propObjects}
            width={width}
            setWidth={setWidth}
          />

          <div css={styles.contents}>
            {/* DEMO OPTIONS */}
            <DemoOptions open={propsDrawerOpen} setOpen={setPropsDrawerOpen} />

            {/* DEMO COMPONENT */}
            <div css={styles.wrapper}>{children}</div>
          </div>
        </main>
        <EditDrawer open={editDrawerOpen} setOpen={setEditDrawerOpen} />
      </div>
    </>
  )
}
