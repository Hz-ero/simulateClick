import React from 'react'
import style from './index.css'

const ResizePanel = (props) => {
  const domStyle = {
    flexBasis: `${props.space}%`
  }

  return (
    <div
      style={domStyle}
      className={style.wrapper}
    >
      {props.children}
    </div>
  )
}

export default ResizePanel
