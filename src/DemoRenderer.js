import React from 'react'
import ReactDOM from 'react-dom'
import DemoComponent from 'DemoFile' //eslint-disable-line
import { createMuiTheme } from '@material-ui/core/styles'
import amber from '@material-ui/core/colors/amber'
import { ThemeProvider } from '@material-ui/styles'
import { css } from '@emotion/core'
import WarningIcon from '@material-ui/icons/ErrorOutline'
import DemoWrapper from './DemoWrapper'
import { isJson, removeQuotes } from './lib/helpers'
import useLocalStorage from './useLocalStorage'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1de9b6',
    },
    secondary: amber,
  },
})

const missingRequiredPropsCss = css`
  display: grid;
  grid-template-columns: max-content max-content;
  grid-column-gap: 4px;
  align-items: center;
  color: red;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 12px;
  border: solid 1px red;
  border-radius: 4px;
`

const container = document.createElement('div')
document.body.appendChild(container)
container.setAttribute('id', 'app')

const { props, displayName } = process.env.COMPONENT_INFO

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

  if (
    typeof defaultValue === 'string' &&
    defaultValue[0] === '{' &&
    defaultValue[defaultValue.length - 1] === '}'
  ) {
    defaultValue = eval(`() => (${defaultValue})`)() //eslint-disable-line
  }

  acc[propName] = defaultValue
  return acc
}, {})
console.log('TCL: props', props)
console.log('TCL: propStateDefaults', propStateDefaults)

function canRender(propStates) {
  const requiredProps = Object.entries(props).filter(entry => entry[1].required)
  return requiredProps.length === 0 || requiredProps.some(entry => propStates[entry[0]])
}

function ComponentDemo() {
  const [propStates, setPropStates] = useLocalStorage(displayName, propStateDefaults)
  return (
    <ThemeProvider theme={theme}>
      <DemoWrapper propStates={propStates} setPropStates={setPropStates}>
        {canRender(propStates) && <DemoComponent {...propStates} />}
        {!canRender(propStates) && (
          <div className="demo-font" css={missingRequiredPropsCss}>
            <WarningIcon />
            All required props must be given a value
          </div>
        )}
      </DemoWrapper>
    </ThemeProvider>
  )
}
ReactDOM.render(<ComponentDemo />, document.getElementById('app'))
