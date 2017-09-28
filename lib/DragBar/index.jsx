import React from 'react'
import style from './index.css'

const DragBar = (props) => {
  // option
  const option = {
    ifHorizontal: props.ifHorizontal || false
  }

  // inline style
  const domStyle = {
    flexBasis: `${props.space}px`
  }

  // modules style
  let moduleStyle = null

  if (option.ifHorizontal) {
    moduleStyle = style.horizontalBar
  } else {
    moduleStyle = style.verticalBar
  }

  // flag: 拖拽
  let dragging = false
  // log: 当前位置
  let currentX, currentY

  const dragStart = (e) => {
    // set flag: 进入拖拽动作
    dragging = true
    currentX = option.ifHorizontal ? e.clientX : null
    currentY = option.ifHorizontal ? null : e.clientY

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', dragEnd)
  }

  const dragEnd = (e) => {
    // set flag: 停止拖拽动作
    dragging = false
    currentX = option.ifHorizontal ? e.clientX : null
    currentY = option.ifHorizontal ? null : e.clientY

    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', dragEnd)

    // 清除上一次存留的拖拽位移
    props.cleanPrevDrag()
  }

  const handleDrag = (e) => {
    let dragValue = 0
    if (option.ifHorizontal) {
      dragValue = e.clientX - currentX
    } else {
      dragValue = e.clientY - currentY
    }

    props.onResize(dragValue)
  }

  return (
    <div
      style={domStyle}
      className={moduleStyle}
      onMouseDown={(e) => dragStart(e)}
      onMouseUp={(e) => dragEnd(e)}
    />
  )
}

export default DragBar
