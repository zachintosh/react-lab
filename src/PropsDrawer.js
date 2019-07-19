import React, { useState } from 'react'
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider'
import { css } from '@emotion/core'
import amber from '@material-ui/core/colors/amber'
import StringNumberInput from './Inputs/StringNumberInput'
import BooleanInput from './Inputs/BooleanInput'
import EnumInput from './Inputs/EnumInput'

const styles = {
  drawerHeader: css`
    padding: 8px 8px 8px 16px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
  `,
  propsContainer: css`
    padding: 8px 16px;
    width: 400px;
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

const { displayName, description, props } = process.env.COMPONENT_INFO

export default function PropsDrawer({ propStates, setPropStates, open, setOpen }) {

  function updatePropState(propName, newState) {
    setPropStates(oldPropStates => {
      return {
        ...oldPropStates,
        [propName]: newState,
      }
    })
  }

  function getInput([propName, propObj]) {
    const inputMap = {
      string: <StringNumberInput updatePropState={updatePropState} propName={propName} propObj={propObj} propStates={propStates} type="string" />,
      number: <StringNumberInput updatePropState={updatePropState} propName={propName} propObj={propObj} propStates={propStates} type="number" />,
      bool: <BooleanInput updatePropState={updatePropState} propName={propName} propObj={propObj} value={propStates[propName]} />,
      enum: <EnumInput updatePropState={updatePropState} propName={propName} propObj={propObj} value={propStates[propName]} />,
    }
    return <div key={propName}>{inputMap[propObj.type.name] || propName}</div>
  }

  const entries = Object.entries(props)
  const stringInputs = entries.filter(([propName, propObj]) => propObj.type.name === 'string' || propObj.type.name === 'number')
  const booleanInputs = entries.filter(([propName, propObj]) => propObj.type.name === 'bool')
  const enumInputs = entries.filter(([propName, propObj]) => propObj.type.name === 'enum')

  return (
    <div css={styles.drawerContainer}>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
      >
        <div css={styles.drawerHeader}>
          <h4>{displayName}</h4>
          <IconButton onClick={() => setOpen(false)}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        {/* <div css={styles.description}>{description}</div> */}
        <div css={styles.propsContainer}>
          {stringInputs.map(getInput)}
          {enumInputs.map(getInput)}
          {booleanInputs.map(getInput)}
        </div>
      </Drawer>
    </div>
  )
}
