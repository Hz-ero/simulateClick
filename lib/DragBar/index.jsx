import React from 'react'
import PropTypes from 'prop-types'
import style from './index.css'

const DragBar = (props) => {
  // inline style
  const domStyle = {
    flexBasis: `${props.space}px`
  }

  // modules style
  let moduleStyle = null
  if (props.ifHorizontal) {
    moduleStyle = style.horizontalBar
  } else {
    moduleStyle = style.verticalBar
  }

  // log: 当前位置
  let currentX, currentY

  const dragStart = (e) => {
    // 屏蔽右键
    if (e.button === 2) {
      return false
    }

    // 记录拖动时的开始位置
    currentX = e.clientX
    currentY = e.clientY

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', dragEnd)
  }

  const dragEnd = (e) => {
    // 清除document事件监听
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', dragEnd)

    // 清除上一次存留的拖拽位移
    props.cleanPrevDrag()
  }

  const handleDrag = (e) => {
    // log: 拖拽距离
    let dragValue = 0
    if (props.ifHorizontal) {
      dragValue = e.clientX - currentX
    } else {
      dragValue = e.clientY - currentY
    }

    // 将拖拽距离传给父组件
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

DragBar.propTypes = {
  ifHorizontal: PropTypes.bool.isRequired,
  space: PropTypes.number.isRequired,
  cleanPrevDrag: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired
}

export default DragBar
