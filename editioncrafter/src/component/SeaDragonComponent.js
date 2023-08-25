import React, { Component } from 'react';

export class SeaDragonComponent extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { side, initViewer, tileSource } = this.props;
    return <div id={`image-view-seadragon-${side}`} ref={(el) => { initViewer(el, tileSource); }} />;
  }
}
