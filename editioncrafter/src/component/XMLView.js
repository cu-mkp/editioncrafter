import React, { Component } from 'react';
import { connect } from 'react-redux';
import Navigation from './Navigation';
import Pagination from './Pagination';
import { loadFolio as downloadFolio } from '../model/Folio';

class XMLView extends Component {
  constructor(props) {
    super(props);
    this.state = { folio: [], isLoaded: false, currentlyLoaded: '' };
  }

  loadFolio(folio) {
    const { side, documentView } = this.props;
    if (typeof folio === 'undefined') {
      // console.log("TranscriptView: Folio is undefined when you called loadFolio()!");
      return;
    }
    console.log('calling downloadFolio');
    downloadFolio(folio).then((data) => {
      const folioID = documentView[side].iiifShortID;
      this.setState({
        folio: data,
        isLoaded: true,
        currentlyLoaded: folioID,
      });
      // this.forceUpdate();
    }, (error) => {
      console.log(`Unable to load transcription: ${error}`);
      // this.forceUpdate();
    });
  }

  // componentDidUpdate(prevProps, prevState) {
  //   // Refresh the content if there is an incoming change
  //   let contentChange = false;
  //   const newFolioID = this.props.documentView[this.props.side].iiifShortID;

  //   if (prevState.currentlyLoaded !== newFolioID) {
  //     contentChange = true;
  //     this.loadFolio(this.props.document.folioIndex[newFolioID]);
  //   }

  //   // TODO make this work for XML view
  //   if (contentChange) {
  //     // Scroll content to top
  //     const selector = `xmlViewComponent_${this.props.side}`;
  //     const el = document.getElementById(selector);
  //     if (el !== null) {
  //       // console.log(selector + "scroll to top");
  //       el.scrollTop = 0;
  //     }
  //   }
  // }

  // RENDER
  render() {
    const {
      side, document, documentView, documentViewActions,
    } = this.props;

    const thisClass = `xmlViewComponent ${side}`;
    const thisID = `xmlViewComponent_${side}`;

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
      return watermark(documentView, documentViewActions, side);
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
