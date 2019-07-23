import React, { useState, useEffect, useRef } from 'react'
// import Drawer from '@material-ui/core/Drawer'
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
    box-sizing: border-box;
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
  grid: css`
    display: grid;
    grid-template-columns: max-content 4px;
    min-height: 100vh;
    box-sizing: border-box;
  `,
  draggableSide: css`
    cursor: ew-resize;
    width: 4px;
    border-right: solid 1px rgba(0, 0, 0, 0.12);
  `,
  contents: css`
    height: 100vh;
    overflow-y: scroll;
    width: calc(100% + 1px);
  `,
}

export default function PropsDrawer({
  propObjects,
  displayName,
  propStates,
  setPropStates,
  open,
  setOpen,
  width,
  setWidth,
}) {
  const widthRef = useRef(width)

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

  const mouseMove = ({ screenX }) => {
    const { current } = widthRef
    if ((screenX < current - 5 || screenX > current + 5) && screenX > 264) {
      setWidth(screenX)
    }
  }

  const mouseUp = () => {
    document.removeEventListener('mousemove', mouseMove)
  }

  const dragStart = () => {
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp, { once: true })
  }

  // This is dumb, but it lets the event listeners get a current value
  useEffect(() => {
    widthRef.current = width
  }, [width])

  const entries = Object.entries(propObjects)
  const inputs = entries.reduce((acc, entry) => {
    if (!acc[entry[1].type.name]) acc[entry[1].type.name] = []
    acc[entry[1].type.name].push(entry)
    return acc
  }, {})

  if (!displayName || !propObjects) return null
  console.log(open)
  return (
    <div
      className="demo-font"
      css={styles.drawerContainer}
      style={{ marginLeft: open ? 0 : (width + 4) * -1 }}
    >
      {/* <Drawer transitionDuration={100} variant="persistent" anchor="left" open={open}> */}
      {/* HEADER */}

      <div css={styles.contents}>
        <div css={styles.drawerHeader}>
          <h4>{displayName}</h4>
          <IconButton onClick={() => setOpen(false)}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />

        {/* PROP INPUTS */}
        <div css={styles.grid}>
          <div css={styles.propsContainer} style={{ width }}>
            {inputs.string && inputs.string.map(getInput)}
            {inputs.number && inputs.number.map(getInput)}
            {inputs.enum && inputs.enum.map(getInput)}
            {inputs.object && inputs.object.map(getInput)}
            {inputs.shape && inputs.shape.map(getInput)}
            {inputs.bool && inputs.bool.map(getInput)}
          </div>
          <div css={styles.draggableSide} onMouseDown={dragStart} />
        </div>
      </div>
      {/* </Drawer> */}
    </div>
  )
}
