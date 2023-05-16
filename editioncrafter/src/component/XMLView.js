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
    downloadFolio(folio).then((data) => {
      console.log(data);
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

  componentDidUpdate() {
    // Refresh the content if there is an incoming change
    let contentChange = false;
    const nextFolioID = this.props.documentView[this.props.side].iiifShortID;
    if (this.state.currentlyLoaded !== nextFolioID) {
      contentChange = true;
      console.log(nextFolioID);
      this.loadFolio(this.props.document.folioIndex[nextFolioID]);
    }

    // TODO make this work for XML view
    if (contentChange) {
      // Scroll content to top
      const selector = `xmlViewComponent_${this.props.side}`;
      const el = document.getElementById(selector);
      if (el !== null) {
        // console.log(selector + "scroll to top");
        el.scrollTop = 0;
      }
    }
  }

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
    } if (!this.state.isLoaded) {
      this.loadFolio(document.folioIndex[folioID]);
      return (
        <div className="watermark">
          <div className="watermark_contents" />
        </div>
      );
    }

    // get the xml for this transcription
    const { transcriptionType } = documentView[side];
    let xmlContent = '';
    if (this.state.folio.transcription) {
      xmlContent = this.state.folio.transcription[transcriptionType].html;
    }

    return (
      <div id={thisID} className={thisClass}>
        <Navigation side={side} documentView={documentView} documentViewActions={documentViewActions} />
        <div className="xmlContent">
          <Pagination side={side} className="pagination_upper" documentView={documentView} documentViewActions={documentViewActions} />

          <div className="xmlContentInner">
            <pre>{xmlContent}</pre>
          </div>

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
