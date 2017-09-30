import React from 'react'
import PropTypes from 'prop-types'
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

ResizePanel.propTypes = {
  space: PropTypes.number.isRequired,
  children: PropTypes.element.isRequired
}

export default ResizePanel
