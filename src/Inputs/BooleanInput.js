import React from 'react'
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function BooleanInput({propName, value, propObj, updatePropState}) {
  const { defaultValue, required } = propObj
  return (
    <FormControlLabel
      control={<Checkbox checked={value} onChange={(e) => updatePropState(propName, e.target.checked)} />}
      label={propName}
    />
  )
}