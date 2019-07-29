import React, { useRef } from 'react'

export default function useResizer(setSize, axis) {
  const sizeRef = useRef()

  const mouseMove = e => {
    const { clientY, clientX } = e
    const { current } = sizeRef

    if (axis === 'y') {
      const newHeight = window.innerHeight - clientY
      if ((newHeight < current - 15 || newHeight > current + 15) && newHeight > 100) {
        setSize(newHeight)
      }
    } else if (axis === 'x') {
      if ((clientX < current - 15 || clientX > current + 15) && clientX > 100) {
        setSize(clientX)
      }
    }
  }

  const mouseUp = () => {
    document.removeEventListener('mousemove', mouseMove)
  }

  const dragStart = () => {
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp, { once: true })
  }

  return [dragStart, sizeRef]
}
