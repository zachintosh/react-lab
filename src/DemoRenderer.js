import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import DemoComponent from 'DemoFile'
import DemoWrapper from './DemoWrapper'
import { createMuiTheme } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';
import { ThemeProvider } from '@material-ui/styles';
import { isJson, removeQuotes } from './lib/helpers'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1de9b6',
    },
    secondary: amber,
  },
});

const container = document.createElement('div')
document.body.appendChild(container)
container.setAttribute('id', 'app')

const { props } = process.env.COMPONENT_INFO

const propStateDefaults = Object.entries(props).reduce((acc, [propName, propObj]) => {
  let defaultValue = propObj.defaultValue && propObj.defaultValue.value
  // Remove extra quotes around strings
  if (defaultValue && typeof defaultValue === 'string') {
    defaultValue = removeQuotes(defaultValue)
  }

  // Switch back to booleans from strings
  if (defaultValue === 'false' || defaultValue === 'true') {
    defaultValue = defaultValue !== 'false'
  }

  defaultValue = isJson(defaultValue) || defaultValue

  acc[propName] = defaultValue
  return acc
}, {})
console.log("TCL: props", props)
console.log("TCL: propStateDefaults", propStateDefaults)

function ComponentDemo() {
  const [propStates, setPropStates] = useState(propStateDefaults)
  return (
    <ThemeProvider theme={theme}>
      <DemoWrapper propStates={propStates} setPropStates={setPropStates}>
        <DemoComponent {...propStates} />
      </DemoWrapper>
    </ThemeProvider>
  )
}
ReactDOM.render(<ComponentDemo />, document.getElementById('app'))

