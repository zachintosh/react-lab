import React from 'react'
import { css } from '@emotion/core'
import Button from '@material-ui/core/Button'

const styles = {
  bar: css`
    background-color: #333;
    color: white;
    padding: 8px;
    display: grid;
    box-sizing: border-box;
    height: 62px;
    grid-column-gap: 12px;
    grid-template-columns: max-content auto max-content max-content;
  `,
}

export default function DemoOptions({ open, setOpen }) {
  return (
    <div css={styles.bar}>
      {!open ? (
        <Button onClick={() => setOpen(true)} variant="text" color="secondary">
          Props
        </Button>
      ) : (
        <span />
      )}
      <span />
      <Button color="primary" variant="text">
        Save As Story
      </Button>

      {/* Experiments */}
      {/* Recent Pids */}
      {/* History List */}
      {/* Go to Github Button */}
      {/* Current Environment */}
      {/* Copy as Story */}
    </div>
  )
}
