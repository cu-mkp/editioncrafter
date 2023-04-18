import React from 'react';

export default class ImageZoomControl extends React.Component {
  render() {
    const in_id = `os-zoom-in ${this.props.side}`;
    const out_id = `os-zoom-out ${this.props.side}`;
    const onZoomGrid = (this.props.documentView.bookMode ? null : this.props.onZoomGrid);
    return (
      <ul className="ImageZoomControl">
        <li><i title="Zoom In" id={in_id} className="zoom-in fas fa-plus-circle fa-2x" /></li>
        <li><i title="Fixed Zoom 1" onClick={this.props.onZoomFixed_1} className="zoom-3 fas fa-circle fa-2x" /></li>
        <li><i title="Fixed Zoom 2" onClick={this.props.onZoomFixed_2} className="zoom-2 fas fa-circle fa-lg" /></li>
        <li><i title="Fixed Zoom 3" onClick={this.props.onZoomFixed_3} className="zoom-1 fas fa-circle" /></li>
        <li><i title="Zoom Out" id={out_id} className="zoom-out fas fa-minus-circle fa-2x" /></li>
        <li className={this.props.documentView.bookMode ? 'disabled' : ''}><i title="Return to grid mode (not available in book mode)" onClick={onZoomGrid} className="zoom-grid fas fa-th fa-2x" /></li>
      </ul>
    );
  }
}
