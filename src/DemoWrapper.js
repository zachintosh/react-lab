import React, { useState } from 'react'
import { Global, css } from '@emotion/core'
import { makeStyles } from '@material-ui/core/styles'
// import CustomWrapper from './CustomWrapper'
import DemoOptions from './DemoOptions'
import PropsDrawer from './PropsDrawer'

const styles = {
  wrapper: css`
    padding: 12px;
    width: fit-content;
  `,
  demoContainer: css`
    display: flex;
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

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 400,
  },
}))

export default function DemoWrapper({ children, propStates, setPropStates }) {
  const [open, setOpen] = useState(true)
  const classes = useStyles()

  const Children = <div css={styles.wrapper}>{children}</div>
  return (
    <div css={styles.demoContainer}>
      <Global styles={styles.global} />
      <main className={`${classes.content} ${open && classes.contentShift}`}>
        <PropsDrawer
          propStates={propStates}
          setPropStates={setPropStates}
          open={open}
          setOpen={setOpen}
        />

        <DemoOptions open={open} setOpen={setOpen} />

        {/* <CustomWrapper> */}
        {Children}
        {/* </CustomWrapper> */}
      </main>
    </div>
  )
}
