import React, { Component } from 'react';
import { connect } from 'react-redux';
import Navigation from './Navigation';
import Pagination from './Pagination';
import Watermark from './Watermark';

class XMLView extends Component {
  // RENDER
  render() {
    const {
      side, document, documentView, documentViewActions,
    } = this.props;

    const thisClass = `xmlViewComponent ${side}`;
    const thisID = `xmlViewComponent_${side}`;

    console.log(documentView);
    // Retrofit - the folios are loaded asynchronously
    const folioID = documentView[side].iiifShortID;
    if (folioID === '-1') {
      return (
        <div className="watermark">
          <div className="watermark_contents" />
        </div>
      );
    }

    const folio = document.folioIndex[folioID];
    if (!folio.transcription) {
      return (
        <Watermark
          documentView={documentView}
          documentViewActions={documentViewActions}
          side={side}
        />
      );
    }

    const { transcriptionType } = documentView[side];
    const transcriptionData = folio.transcription[transcriptionType];
    const { xml: xmlContent } = transcriptionData;

    return (
      <div id={thisID} className={thisClass}>
        <Navigation side={side} documentView={documentView} documentViewActions={documentViewActions} />
        <Pagination side={side} className="pagination_upper" documentView={documentView} documentViewActions={documentViewActions} />

        <div className="xmlContentInner">
          <pre>{xmlContent}</pre>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    document: state.document,
  };
}

export default connect(mapStateToProps)(XMLView);
