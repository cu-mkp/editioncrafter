import React from 'react'

function ImageZoomControl(props) {
  const in_id = `os-zoom-in ${props.side}`
  const out_id = `os-zoom-out ${props.side}`
  const onZoomGrid = (props.documentView.bookMode ? null : props.onZoomGrid)
  return (
    <ul className="ImageZoomControl">
      <li><i title="Zoom In" id={in_id} onClick={props.onZoomIn} className="zoom-in fas fa-plus-circle fa-2x" /></li>
      <li><i title="Fixed Zoom 1" onClick={props.onZoomFixed_1} className="zoom-3 fas fa-circle fa-2x" /></li>
      <li><i title="Fixed Zoom 2" onClick={props.onZoomFixed_2} className="zoom-2 fas fa-circle fa-lg" /></li>
      <li><i title="Fixed Zoom 3" onClick={props.onZoomFixed_3} className="zoom-1 fas fa-circle" /></li>
      <li><i title="Zoom Out" id={out_id} onClick={props.onZoomOut} className="zoom-out fas fa-minus-circle fa-2x" /></li>
      <li className={props.documentView.bookMode ? 'disabled' : ''}><i title="Return to grid mode (not available in book mode)" onClick={onZoomGrid} className="zoom-grid fas fa-th fa-2x" /></li>
    </ul>
  )
}

export default ImageZoomControl
