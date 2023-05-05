import React, { Component } from 'react';
import { connect } from 'react-redux';

class SplitPaneView extends Component {
  render() {
    return (
      <div className="single-pane-view">
        {this.props.singlePane}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    document: state.document,
  };
}
export default connect(mapStateToProps)(SplitPaneView);
