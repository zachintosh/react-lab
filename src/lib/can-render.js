export default function canRender(props = {}, propStates = {}) {
  console.log('TCL: canRender -> props', Object.entries(props))
  console.log('TCL: canRender -> propStates', propStates)

  if (!propStates || !props) return false

  const allHaveValues = Object.entries(props).every(([propName, propObj]) => {
    if (propObj.type.name === 'shape' || propObj.type.name === 'exact') {
      // If it isn't required, it's good to go
      console.log(propObj)
      if (!propObj.required) return true
      // Otherwise, check all values on the object to see if they have a value
      return Object.entries(propObj.type.value).every(([subPropName, subPropObj]) => {
        console.log('TCL: canRender -> subPropObj', subPropObj)
        console.log('TCL: canRender -> subPropName', subPropName)
        if (!subPropObj.required) return true
        return propStates[propName][subPropName]
      })
    }

    return !propObj.required || propStates[propName]
  })

  const noRequiredProps = Object.entries(props).length === 0
  return propStates && (noRequiredProps || allHaveValues)
}
