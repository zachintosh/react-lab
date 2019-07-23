import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Divider from '@material-ui/core/Divider'
import { css } from '@emotion/core'
import amber from '@material-ui/core/colors/amber'
import StringNumberInput from './Inputs/StringNumberInput'
import BooleanInput from './Inputs/BooleanInput'
import EnumInput from './Inputs/EnumInput'
import ObjectInput from './Inputs/ObjectInput'

const styles = {
  drawerHeader: css`
    padding: 0 8px 0 16px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    box-sizing: border-box;
  `,
  propsContainer: css`
    padding: 8px 16px;
    width: 400px;
    box-sizing: border-box;
    max-width: 400px;
    display: grid;
    grid-row-gap: 8px;

    & .MuiFormControl-root {
      width: 100%;
      margin-top: 8px;
      margin-bottom: 4px;
    }

    & .Mui-required:not(.MuiFormLabel-filled) {
      color: ${amber[900]};
    }
  `,
  description: css`
    width: 400px;
    font-size: 12px;
    padding: 8px;
  `,
}

export default function PropsDrawer({
  propObjects,
  displayName,
  propStates,
  setPropStates,
  open,
  setOpen,
}) {
  function updatePropState(propName, newState) {
    setPropStates(oldPropStates => ({
      ...oldPropStates,
      [propName]: newState,
    }))
  }

  function getInput([propName, propObj]) {
    const inputMap = {
      string: (
        <StringNumberInput
          updatePropState={updatePropState}
          propName={propName}
          propObj={propObj}
          value={propStates[propName]}
          type="string"
        />
      ),
      number: (
        <StringNumberInput
          updatePropState={updatePropState}
          propName={propName}
          propObj={propObj}
          value={propStates[propName]}
          type="number"
        />
      ),
      bool: (
        <BooleanInput
          updatePropState={updatePropState}
          propName={propName}
          value={propStates[propName]}
        />
      ),
      enum: (
        <EnumInput
          updatePropState={updatePropState}
          propName={propName}
          propObj={propObj}
          value={propStates[propName]}
        />
      ),
      object: (
        <ObjectInput
          updatePropState={updatePropState}
          propName={propName}
          value={propStates[propName]}
        />
      ),
      shape: (
        <ObjectInput
          updatePropState={updatePropState}
          propName={propName}
          value={propStates[propName]}
        />
      ),
    }
    return <div key={propName}>{inputMap[propObj.type.name] || propName}</div>
  }

  const entries = Object.entries(propObjects)
  const inputs = entries.reduce((acc, entry) => {
    if (!acc[entry[1].type.name]) acc[entry[1].type.name] = []
    acc[entry[1].type.name].push(entry)
    return acc
  }, {})

  if (!displayName || !propObjects) return null

  return (
    <div className="demo-font" css={styles.drawerContainer}>
      <Drawer variant="persistent" anchor="left" open={open}>
        <div css={styles.drawerHeader}>
          <h4>{displayName}</h4>
          <IconButton onClick={() => setOpen(false)}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        {/* <div css={styles.description}>{description}</div> */}
        <div css={styles.propsContainer}>
          {inputs.string && inputs.string.map(getInput)}
          {inputs.number && inputs.number.map(getInput)}
          {inputs.enum && inputs.enum.map(getInput)}
          {inputs.object && inputs.object.map(getInput)}
          {inputs.shape && inputs.shape.map(getInput)}
          {inputs.bool && inputs.bool.map(getInput)}
        </div>
      </Drawer>
    </div>
  )
}
