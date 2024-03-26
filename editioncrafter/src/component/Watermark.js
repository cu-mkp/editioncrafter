import React from 'react';
import Navigation from './Navigation';
import Pagination from './Pagination';

const Watermark = ({ side, documentView, documentViewActions }) => (
  <div style={{ position: "relative" }}>
    { documentView.left.iiifShortID !== '-1' && documentView.right.iiifShortID !== '-1'
      ? <Navigation side={side} documentView={documentView} documentViewActions={documentViewActions} />
      : null}
    <div className="transcriptContent">
      <Pagination side={side} className="pagination_upper" documentView={documentView} documentViewActions={documentViewActions} />
      <div className="watermark">
        <div className={ side !== 'third' ? "watermark_contents" : "third_pane_blank"} />
      </div>
    </div>
  </div>
);

export default Watermark;
