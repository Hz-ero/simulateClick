import React from 'react'
import ReactDOM from 'react-dom'
import style from './index.css'
import DragBar from './DragBar/index.jsx'
import ResizePanel from './ResizePanel/index.jsx'

const getDomStyle = (ele) => {
  const style = ele.currentStyle ? ele.currentStyle : window.getComputedStyle(ele, null)

  return style
}

const InitForwardComp = (props) => (
  <div>
    forwardComp!
  </div>
)

const InitBackwardComp = (props) => (
  <div>
    backwardComp!
  </div>
)

class SplitPanel extends React.Component {
  constructor (props) {
    super(props)

    this.handleResize = this.handleResize.bind(this)
    this.handleCleanPrevDrag = this.handleCleanPrevDrag.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)

    this.state = {
      ifHorizontal: props.ifHorizontal || false,
      splitSpace: props.splitSpace || 20,
      prevDragValue: 0
    }
  }

  componentDidMount () {
    const dom = ReactDOM.findDOMNode(this)
    const totalWidth = Number.parseFloat(getDomStyle(dom).width)
    const totalHeight = Number.parseFloat(getDomStyle(dom).height)
    let splitSpacePer = 0

    // set space percent
    if (this.state.ifHorizontal) {
      splitSpacePer = this.state.splitSpace / totalWidth
    } else {
      splitSpacePer = this.state.splitSpace / totalHeight
    }
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

  onWindowResize (e) {
    const dom = ReactDOM.findDOMNode(this)
    const totalWidth = Number.parseFloat(getDomStyle(dom).width)
    const totalHeight = Number.parseFloat(getDomStyle(dom).height)
    let newForwardSapcePer = 0
    let newBackwardSapcePer = 0
    const {
      ifHorizontal,
      splitSpace,
      forwardSpacePer,
      backwardSpacePer
    } = this.state

    const prevTotalSpace = (splitSpace * 100) / (100 - forwardSpacePer - backwardSpacePer)

    if (ifHorizontal) {
      newForwardSapcePer = (totalWidth - splitSpace) * (prevTotalSpace * forwardSpacePer) / (prevTotalSpace - splitSpace) / totalWidth
      newBackwardSapcePer = (totalWidth - splitSpace) * (prevTotalSpace * backwardSpacePer) / (prevTotalSpace - splitSpace) / totalWidth
    } else {
      newForwardSapcePer = (totalHeight - splitSpace) * (prevTotalSpace * forwardSpacePer) / (prevTotalSpace - splitSpace) / totalHeight
      newBackwardSapcePer = (totalHeight - splitSpace) * (prevTotalSpace * backwardSpacePer) / (prevTotalSpace - splitSpace) / totalHeight
    }

    this.setState(() => ({
      forwardSpacePer: newForwardSapcePer,
      backwardSpacePer: newBackwardSapcePer
    }))
  }

  handleCleanPrevDrag () {
    this.setState({
      prevDragValue: 0
    })
  }

  handleResize (dragValue) {
    let movePer
    const dom = ReactDOM.findDOMNode(this)
    const totalWidth = Number.parseFloat(getDomStyle(dom).width)
    const totalHeight = Number.parseFloat(getDomStyle(dom).height)

    if (this.state.ifHorizontal) {
      movePer = (dragValue - this.state.prevDragValue) * 100 / totalWidth
    } else {
      movePer = (dragValue - this.state.prevDragValue) * 100 / totalHeight
    }

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
        <ResizePanel
          space={this.state.forwardSpacePer}
        >
          {forwardComp}
        </ResizePanel>
        <DragBar
          ifHorizontal={this.state.ifHorizontal}
          space={this.state.splitSpace}
          cleanPrevDrag={this.handleCleanPrevDrag}
          onResize={this.handleResize}
        />
        <ResizePanel
          space={this.state.backwardSpacePer}
        >
          {backwardComp}
        </ResizePanel>
      </div>
    )
  }
}

export default SplitPanel
