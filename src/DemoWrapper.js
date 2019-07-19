import React, { useState } from 'react'
import Root from '@fs/zion-root'
import DemoOptions from './DemoOptions'
import { Router, AuthRoute } from '@fs/zion-router'
import { css } from '@emotion/core'
import { makeStyles } from '@material-ui/core/styles'
import PropsDrawer from './PropsDrawer'

// This is where you pass data from the server to the client using the SERVER_DATA global.
// Here we pass the mounted app path from the server to the client.
const base = window.SERVER_DATA ? new URL(window.SERVER_DATA.appPath).pathname : ''

const styles = {
  wrapper: css`
    padding-top: 20px;
  `,
  demoContainer: css`
    display: flex;
  `
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
  }
}))

export default function DemoWrapper({ children, propStates, setPropStates }) {
  const [open, setOpen] = useState(true)
  const classes = useStyles();

  const Children = <div css={styles.wrapper}>{children}</div>
  return (
    <div css={styles.demoContainer}>
      <main className={`${classes.content} ${open && classes.contentShift}`}>
        <PropsDrawer propStates={propStates} setPropStates={setPropStates} open={open} setOpen={setOpen} />
        <DemoOptions open={open} setOpen={setOpen} />
        <Root header={false} footer={false}>
          <Router basename={base}>
            {/* <AuthRoute path="/" component={Children} /> */}
            {Children}
          </Router>
        </Root>
      </main>
    </div>
  )
}