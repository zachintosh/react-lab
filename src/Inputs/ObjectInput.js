import React from 'react'
import { css } from '@emotion/core'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/github'

const styles = {
  objectContainer: css`
    white-space: pre;
    border: solid 1px rgba(0, 0, 0, 0.23);
    padding-top: 8px;
    border-radius: 4px;
    width: 368px;
    position: relative;
    margin-top: 8px;

    & .ace_editor {
      width: 100% !important;
      box-sizing: border-box;
    }

    &:focus-within {
      border-color: #1de9b6;
      border-width: 2px;
      margin: -1px;
      margin-top: 7px;
    }
  `,
}

export default function ObjectInput({ propName, value, updatePropState }) {
  console.log('TCL: ObjectInput -> value', value)
  const editorRef = React.useRef()

  const labelCss = css`
    &::before {
      content: "${propName}";
      position: absolute;
      font-size: 1rem;
      transform: scale(0.75);
      font-weight: 400;
      letter-spacing: 0.00938em;
      font-family: "Roboto", "Helvetica", "Arial", sans-serif;
      color: rgba(0, 0, 0, 0.54);
      top: -10px;
      left: 0px;
      padding: 0 4px;
      background-color: white;
      z-index: 1000;
    }
  `

  React.useEffect(() => {
    setTimeout(() => {
      editorRef.current.editor.renderer.setScrollMargin(8, 8, 8, 8)
    }, 0)
  }, [])

  return (
    <div css={[styles.objectContainer, labelCss]}>
      <AceEditor
        ref={editorRef}
        mode="json"
        showPrintMargin={false}
        value={JSON.stringify(value, null, 4)}
        theme="github"
        name={propName}
        maxLines="20"
        scrollMargin="12px 0"
        onChange={newText => {
          try {
            const newValue = eval(`() => (${newText})`)() // eslint-disable-line
            updatePropState(propName, newValue) // eslint-disable-line
          } catch (e) {
            console.error(e)
          }
        }}
      />
    </div>
  )
}
