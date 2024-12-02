import React, { Component } from 'react'
import { connect } from 'react-redux'

class SinglePaneView extends Component {
  render() {
    return (
      <div className="single-pane-view">
        {this.props.singlePane}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    document: state.document,
  }
}
export default connect(mapStateToProps)(SinglePaneView)
