import React from 'react'
import TextField from '@material-ui/core/TextField'

export default function StringNumberInput({
  type,
  propName,
  propStates,
  propObj,
  updatePropState,
}) {
  const { defaultValue, required } = propObj
  return (
    <TextField
      id={propName}
      label={propName}
      variant="outlined"
      defaultValue={defaultValue ? defaultValue.value : ''}
      value={propStates[propName]}
      required={required}
      margin="dense"
      type={type}
      onChange={e => updatePropState(propName, e.target.value)}
    />
  )
}
