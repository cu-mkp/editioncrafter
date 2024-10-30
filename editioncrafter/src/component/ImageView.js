import { connect } from 'react-redux';
import React from 'react';
import Navigation from './Navigation';

const ImageView = (props) => {
  const folio = props.document.folioIndex[props.folioID];

  return (
    <div className={`imageViewComponent image-view ${props.side}`} style={{ position: 'relative' }}>
      <Navigation
        side={props.side}
        documentView={props.documentView}
        documentViewActions={props.documentViewActions}
        documentName={props.document.variorum && props.document.folioIndex[props.folioID].doc_id}
      />
      <div className="image-view-image-container">
        <img alt={folio.name} className="image-view-image" src={folio.image_zoom_url} />
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    document: state.document,
  };
}

export default connect(mapStateToProps)(ImageView);
