import React from 'react';
import Navigation from './Navigation';
import Pagination from './Pagination';

const Watermark = ({ side, documentView, documentViewActions }) => (
  <div>
    <Navigation side={side} documentView={documentView} documentViewActions={documentViewActions} />
    <div className="transcriptContent">
      <Pagination side={side} className="pagination_upper" documentView={documentView} documentViewActions={documentViewActions} />
      <div className="watermark">
        <div className="watermark_contents" />
      </div>
    </div>
  </div>
);

export default Watermark;
