import React from 'react'
import { css } from '@emotion/core'
import amber from '@material-ui/core/colors/amber'
import Button from '@material-ui/core/Button'
import getInput from './lib/get-input'

const styles = {
  propsContainer: css`
    padding: 8px 16px;
    min-width: 250px;
    box-sizing: border-box;
    display: grid;
    grid-row-gap: 8px;
    overflow-y: scroll;
    max-height: 100%;

    & .MuiFormControl-root {
      width: 100%;
      margin-top: 8px;
      margin-bottom: 4px;
    }

    & .Mui-required:not(.MuiFormLabel-filled) {
      color: ${amber[900]};
    }
  `,
  propsDrawer: css`
    padding-top: 8px;
    background-color: #fcfcfc;
    transition: margin-right 0.2s ease-in-out;
    border: solid 1px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
  `,
}

export default function PropsDrawer({
  propObjects,
  propStates,
  open,
  setEditItem,
  updatePropState,
  resetToDefaults,
}) {
  if (!propObjects) return null

  const entries = Object.entries(propObjects)
  const inputs = entries.reduce((acc, entry) => {
    if (!entry[1] || !entry[1].type) return acc
    if (!acc[entry[1].type.name]) acc[entry[1].type.name] = []
    acc[entry[1].type.name].push(entry)
    return acc
  }, {})

  const style = {
    display: open ? 'block' : 'none',
  }

  function getInputProp(entry) {
    return getInput(entry, propStates, updatePropState, setEditItem)
  }

  return (
    <div css={styles.propsDrawer} style={style} className="demo-font">
      <div css={styles.propsContainer}>
        {inputs.string && inputs.string.map(getInputProp)}
        {inputs.number && inputs.number.map(getInputProp)}
        {inputs.enum && inputs.enum.map(getInputProp)}
        {inputs.object && inputs.object.map(getInputProp)}
        {inputs.array && inputs.array.map(getInputProp)}
        {inputs.shape && inputs.shape.map(getInputProp)}
        {inputs.exact && inputs.exact.map(getInputProp)}
        {inputs.bool && inputs.bool.map(getInputProp)}
        <Button size="small" color="primary" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
//
