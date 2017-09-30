import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import style from './index.css'
import DragBar from './DragBar/index.jsx'
import ResizePanel from './ResizePanel/index.jsx'

/**
 * 获取DOM节点的计算后样式 
 * @param {DomNode} ele 
 * @returns {Object} 
 */
const getDomStyle = (ele) => {
  const style = ele.currentStyle ? ele.currentStyle : window.getComputedStyle(ele, null)

  return style
}

// 定义两个组件用于初始化显示，如果用户没有提供内容则会显示他们
const InitForwardComp = () => (
  <div> forwardComp! </div>
)
const InitBackwardComp = () => (
  <div> backwardComp! </div>
)

class SplitPanel extends React.Component {
  constructor (props) {
    super(props)
    // function bindding
    this.handleResize = this.handleResize.bind(this)
    this.handleCleanPrevDrag = this.handleCleanPrevDrag.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)
    // init state
    this.state = {
      ifHorizontal: props.ifHorizontal,
      splitSpace: props.splitSpace,
      forwardSpacePer: 0,
      backwardSpacePer: 0,
      prevDragValue: 0
    }
  }

  componentDidMount () {
    const dom = ReactDOM.findDOMNode(this)
    // 获取SplitPanel组件总尺寸
    const totalWidth = Number.parseFloat(getDomStyle(dom).width)
    const totalHeight = Number.parseFloat(getDomStyle(dom).height)

    // 计算拖动条所占百分比
    let splitSpacePer = 0
    if (this.state.ifHorizontal) {
      splitSpacePer = this.state.splitSpace / totalWidth
    } else {
      splitSpacePer = this.state.splitSpace / totalHeight
    }

    // 根据拖动条占比计算内部前后两个组件所占空间百分比
    this.setState({
      forwardSpacePer: Number.parseFloat(((1 - splitSpacePer) * 100 / 2).toFixed(4)),
      backwardSpacePer: Number.parseFloat(((1 - splitSpacePer) * 100 / 2).toFixed(4))
    })

    // 监听窗口尺寸变化
    window.addEventListener('resize', this.onWindowResize)
  }

  componentWillUnmount () {
    // 取消监听窗口尺寸变化
    window.removeEventListener('resize', this.onWindowResize)
  }

  // 当窗口尺寸变化时重新计算各组件空间百分比
  onWindowResize (e) {
    const dom = ReactDOM.findDOMNode(this)
    // 获取SplitPanel组件总尺寸
    const totalWidth = Number.parseFloat(getDomStyle(dom).width)
    const totalHeight = Number.parseFloat(getDomStyle(dom).height)

    
    // resize前状态
    const {
      ifHorizontal,
      splitSpace,
      forwardSpacePer,
      backwardSpacePer
    } = this.state

    // 计算resize前SplitPanel组件所占空间值
    const prevTotalSpace = (splitSpace * 100) / (100 - forwardSpacePer - backwardSpacePer)

    // 计算内部前后两个组件新的空间占比
    let newForwardSapcePer = 0
    let newBackwardSapcePer = 0
    if (ifHorizontal) {
      newForwardSapcePer = (totalWidth - splitSpace) * (prevTotalSpace * forwardSpacePer) / (prevTotalSpace - splitSpace) / totalWidth
      newBackwardSapcePer = (totalWidth - splitSpace) * (prevTotalSpace * backwardSpacePer) / (prevTotalSpace - splitSpace) / totalWidth
    } else {
      newForwardSapcePer = (totalHeight - splitSpace) * (prevTotalSpace * forwardSpacePer) / (prevTotalSpace - splitSpace) / totalHeight
      newBackwardSapcePer = (totalHeight - splitSpace) * (prevTotalSpace * backwardSpacePer) / (prevTotalSpace - splitSpace) / totalHeight
    }

    // 给内部组件占比重新赋值
    this.setState(() => ({
      forwardSpacePer: newForwardSapcePer,
      backwardSpacePer: newBackwardSapcePer
    }))
  }

  // 对上一次拖动记录清零
  handleCleanPrevDrag () {
    this.setState({
      prevDragValue: 0
    })
  }

  handleResize (dragValue) {
    const dom = ReactDOM.findDOMNode(this)
    // 获取SplitPanel组件总尺寸
    const totalWidth = Number.parseFloat(getDomStyle(dom).width)
    const totalHeight = Number.parseFloat(getDomStyle(dom).height)

    // 计算拖动距离所占百分比
    let movePer
    if (this.state.ifHorizontal) {
      movePer = (dragValue - this.state.prevDragValue) * 100 / totalWidth
    } else {
      movePer = (dragValue - this.state.prevDragValue) * 100 / totalHeight
    }

    // 重新赋值，赋值结束后记录当前拖动距离，由prevDragValue保存
    this.setState(
      (prevState, props) => ({
        forwardSpacePer: prevState.forwardSpacePer + movePer,
        backwardSpacePer: prevState.backwardSpacePer - movePer
      }),
      () => {
        this.setState({
          prevDragValue: dragValue
        })
      }
    )
  }

  render () {
    const domStyle = {
      flexDirection: this.state.ifHorizontal ? 'row' : 'column'
    }

    let forwardComp = null
    let backwardComp = null
    if (!this.props.children) {
      forwardComp = <InitForwardComp />
      backwardComp = <InitBackwardComp />
    } else if (!this.props.children.length) {
      forwardComp = this.props.children
      backwardComp = <InitBackwardComp />
    } else {
      forwardComp = this.props.children[0]
      backwardComp = this.props.children[1]
    }

    return (
      <div
        style={domStyle}
        className={style.wrapper}
      >

        {/* ResizePanel */}
        <ResizePanel
          space={this.state.forwardSpacePer}
        >
          {forwardComp}
        </ResizePanel>

        {/* 拖动条 */}
        <DragBar
          ifHorizontal={this.state.ifHorizontal}
          space={this.state.splitSpace}
          cleanPrevDrag={this.handleCleanPrevDrag}
          onResize={this.handleResize}
        />

        {/* ResizePanel */}
        <ResizePanel
          space={this.state.backwardSpacePer}
        >
          {backwardComp}
        </ResizePanel>
      </div>
    )
  }
}

// 为属性指定默认值:
SplitPanel.defaultProps = {
  ifHorizontal: false,
  splitSpace: 20
}

SplitPanel.propTypes = {
  ifHorizontal: PropTypes.bool,
  splitSpace: PropTypes.number
}

export default SplitPanel
