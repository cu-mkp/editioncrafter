import React, { Component } from 'react'
import { connect } from 'react-redux'

class SplitPaneView extends Component {
  constructor(props) {
    super()
    this.firstFolio = props.document.folios[0]
    // Initialize the splitter
    this.rightPaneMinWidth = props.rightPane.props.documentView.right.transcriptionType === 'glossary' ? 450 : 200
    this.leftPaneMinWidth = props.leftPane.props.documentView.left.transcriptionType === 'glossary' ? 450 : 200
    this.thirdPaneMinWidth = props.thirdPane.props.documentView.third.transcriptionType === 'glossary' ? 450 : props.thirdPane.props.documentView.third.transcriptionType === 'g' ? 0 : 200
    this.splitFraction = props.threePanel ? 0.49 : 0.5
    this.splitFractionRight = props.threePanel ? 0.01 : 0
    this.dividerWidth = 16
    const whole = window.innerWidth
    const leftW = whole / 3

    const split_left = (leftW / whole)
    const split_right = (1 - split_left) / 2
    const split_third = 1 - split_left - split_right
    this.state = {
      style: {
        gridTemplateColumns: `${this.splitFraction}fr ${this.dividerWidth}px ${1 - this.splitFraction - this.splitFractionRight}fr ${this.dividerWidth}px ${this.splitFractionRight}fr`,
      },
    }

    // event handlers
    this.dragging = false
    this.activeDivider = 0
    this.onDrag = this.onDrag.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onEndDrag = this.onEndDrag.bind(this)
    this.updatePaneSize = this.updatePaneSize.bind(this)
    this.updatePaneSize = this.updatePaneSize.bind(this)
  }

  // On drag, update the UI continuously
  onDrag = (e) => {
    if (this.dragging) {
      const whole = window.innerWidth - 2 * this.dividerWidth
      let left_viewWidth
      let right_viewWidth
      let third_viewWidth
      if (this.activeDivider === 1) {
        left_viewWidth = e.clientX - this.dividerWidth / 2
        third_viewWidth = whole * this.splitFractionRight
        right_viewWidth = whole - left_viewWidth - third_viewWidth
      }
      else {
        third_viewWidth = whole - e.clientX - this.dividerWidth / 2
        left_viewWidth = whole * this.splitFraction
        right_viewWidth = whole - left_viewWidth - third_viewWidth
      }
      // Update as long as we're within limits
      if (left_viewWidth >= this.leftPaneMinWidth
        && right_viewWidth >= this.rightPaneMinWidth
        && third_viewWidth >= this.thirdPaneMinWidth) {
        this.splitFraction = (whole === 0) ? 0.0 : left_viewWidth / whole
        this.splitFractionRight = (whole === 0) ? 0.0 : third_viewWidth / whole
        this.updateUI()
      }

      this.updatePaneSize()
    }
  }

  // Drag start: mark it
  onStartDrag = (position) => {
    this.dragging = true
    this.activeDivider = position === 'first' ? 1 : 2
  }

  // Drag end
  onEndDrag = (e) => {
    this.dragging = false
    this.activeDivider = 0
  }

  // On window resize
  onResize = (e) => {
    this.updatePaneSize()
  }

  // Update the screen with the new split info
  updateUI() {
    const left = this.splitFraction
    const third = this.splitFractionRight
    const right = 1.0 - left - third
    this.setState({
      ...this.state,
      style: {
        ...this.state.style,
        gridTemplateColumns: `${left}fr ${this.dividerWidth}px ${right}fr ${this.dividerWidth}px ${third}fr`,
      },
    })
  }

  // Update the sizes of the panes
  updatePaneSize() {
    // Record state change
    const left_px = Math.floor(Math.abs(window.innerWidth * this.splitFraction))
    const third_px = Math.floor(Math.abs(window.innerWidth * this.splitFractionRight))
    const right_px = Math.floor(window.innerWidth * (1.0 - this.splitFraction - this.splitFractionRight))
    if (this.props.onWidth && left_px >= this.leftPaneMinWidth && right_px >= this.rightPaneMinWidth && third_px >= this.thirdPaneMinWidth) {
      this.props.onWidth(left_px, right_px, third_px)
    }
  }

  componentDidMount() {
    this.updateUI()
    window.addEventListener('pointermove', this.onDrag)
    window.addEventListener('pointerup', this.onEndDrag)
    window.addEventListener('resize', this.onResize)
    // Set the default width on mount
    if (this.props.onWidth) {
      const left_px = Math.floor(Math.abs(window.innerWidth * this.splitFraction))
      const right_px = Math.floor(window.innerWidth * (1.0 - this.splitFraction))
      const third_px = Math.floor(window.innerWidth * (1.0 - this.splitFraction))
      this.props.onWidth(left_px, right_px, third_px)
    }
  }

  componentDidUpdate(prevProps) {
    this.rightPaneMinWidth = this.props.rightPane.props.documentView.right.transcriptionType === 'glossary' ? 450 : 200
    this.leftPaneMinWidth = this.props.leftPane.props.documentView.left.transcriptionType === 'glossary' ? 450 : 200
    this.thirdPaneMinWidth = this.props.thirdPane.props.documentView.third.transcriptionType === 'glossary' ? 450 : this.props.thirdPane.props.documentView.third.transcriptionType === 'g' ? 0 : 200
  }

  componentWillUnmount() {
    window.removeEventListener('pointermove', this.onDrag)
    window.removeEventListener('pointerup', this.onEndDrag)
    window.removeEventListener('resize', this.onResize)
  }

  renderDivider(position) {
    const drawerIconClass = 'drawer-icon fas fa-caret-left fa-2x'

    return (
      <div className={`divider ${position}_divider`} onPointerDown={() => this.onStartDrag(position)}>
        <div className="drawer-button hidden" onClick={this.onDrawerButton}>
          <i className={drawerIconClass}> </i>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="split-pane-view three-pane" style={{ ...this.state.style }}>
        { this.props.leftPane }
        { this.renderDivider('first') }
        { this.props.rightPane }
        { this.props.threePanel && this.renderDivider('second') }
        { this.props.threePanel && this.props.thirdPane }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    document: state.document,
  }
}
export default connect(mapStateToProps)(SplitPaneView)
