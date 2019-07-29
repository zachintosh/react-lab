import React from 'react'
import { css } from '@emotion/core'
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit'

const styles = {
  objectContainer: css`
    width: 100%;
    position: relative;
    box-sizing: border-box;

    & .MuiButtonBase-root {
      width: 100%;
      text-transform: unset;
    }

    & .MuiButtonBase-root .MuiButton-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `,
}

export default function ObjectInput({ propName, value, warnings = [], setEditItem }) {
  return (
    <div css={styles.objectContainer}>
      <Button
        variant="text"
        onClick={() =>
          setEditItem({
            propName,
            value,
            warnings,
          })
        }
      >
        {propName}
        <EditIcon fontSize="small" />
      </Button>
    </div>
  )
}
