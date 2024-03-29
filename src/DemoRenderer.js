import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import DemoComponent from 'DemoFile' //eslint-disable-line
import { createMuiTheme } from '@material-ui/core/styles'
import amber from '@material-ui/core/colors/amber'
import indigo from '@material-ui/core/colors/indigo'
import { ThemeProvider } from '@material-ui/styles'
import { css } from '@emotion/core'
import WarningIcon from '@material-ui/icons/ErrorOutline'
import DemoWrapper from './DemoWrapper'
import { isJson, removeQuotes } from './lib/helpers'
import useLocalStorage from './useLocalStorage'
import canRender from './lib/can-render'

const theme = createMuiTheme({
  palette: {
    primary: indigo,
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

// Add the app container so react can render
const container = document.createElement('div')
document.body.appendChild(container)
container.setAttribute('id', 'app')

/**
 * Gets the default states for the props
 * @param {} props
 */
function getPropStateDefaults(props) {
  if (!props) return {}
  return Object.entries(props).reduce((acc, [propName, propObj]) => {
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
}

function ComponentDemo() {
  const [componentInfo, setComponentInfo] = useState()
  const [propStates, setPropStates, setKey] = useLocalStorage()

  function resetToDefaults() {
    setPropStates(getPropStateDefaults(componentInfo.props))
  }

  // WEB SOCKET
  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.hostname}:8001`)
    socket.addEventListener('message', e => {
      const message = JSON.parse(e.data)
      setComponentInfo(message)
    })

    // Let the server know we're ready for the component info
    socket.onopen = () => {
      socket.send('CONNECTED')
    }
  }, [])

  useEffect(() => {
    if (!componentInfo) return
    const key = `${componentInfo.displayName}_props`
    setKey(key)
    const storedValues = JSON.parse(localStorage.getItem(key)) || {}
    const defaultValues = getPropStateDefaults(componentInfo.props)
    const currentValues = Object.entries(storedValues).reduce((acc, [propName, value]) => {
      if (value) acc[propName] = value
      return acc
    }, defaultValues)

    setPropStates(currentValues)
  }, [componentInfo])

  const canRenderComponent = componentInfo && canRender(componentInfo.props, propStates)
  return (
    <ThemeProvider theme={theme}>
      {componentInfo && propStates && (
        <DemoWrapper
          displayName={componentInfo.displayName}
          propObjects={componentInfo.props}
          propStates={propStates}
          setPropStates={setPropStates}
          resetToDefaults={resetToDefaults}
        >
          {/* DEMO COMPONENT */}
          {canRenderComponent && <DemoComponent {...propStates} />}

          {/* MISSING REQUIRED PROPS */}
          {!canRenderComponent && (
            <div className="demo-font" css={missingRequiredPropsCss}>
              <WarningIcon />
              All required props must be given a value
            </div>
          )}
        </DemoWrapper>
      )}
    </ThemeProvider>
  )
}
ReactDOM.render(<ComponentDemo />, document.getElementById('app'))
