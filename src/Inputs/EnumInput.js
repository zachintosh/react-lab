import React from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import { removeQuotes } from '../lib/helpers'

export default function EnumInput({ propName, value, propObj, updatePropState }) {
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);
  return (
    <FormControl variant="outlined">
      <InputLabel margin="dense" ref={inputLabel} htmlFor={propName + '_select'}>
        {propName}
      </InputLabel>
      <Select
        native
        value={value}
        variant="outlined"
        input={
          <OutlinedInput labelWidth={labelWidth} margin="dense" name="age" id={propName + '_select'} />
        }
      >
        {propObj.type.value.map(option => {
          const trimmed = removeQuotes(option.value)
          return <option value={trimmed}>{trimmed || undefined}</option>
        })}
      </Select>
    </FormControl>
  )
}