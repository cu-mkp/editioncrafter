import React, { Component } from 'react';
import { connect } from 'react-redux';
import Navigation from './Navigation';
import Pagination from './Pagination';
import DocumentHelper from '../model/DocumentHelper';

class XMLView extends Component {
  constructor(props) {
    super(props);
    this.state = { folio: [], isLoaded: false, currentlyLoaded: '' };
    this.contentChange = true;
  }

  loadFolio(folio) {
    if (typeof folio === 'undefined') {
      // console.log("TranscriptView: Folio is undefined when you called loadFolio()!");
      return;
    }
    folio.load().then((folio) => {
      const folioID = this.props.documentView[this.props.side].iiifShortID;
      const folioURL = DocumentHelper.folioURL(folioID);
      this.setState({
        folio,
        isLoaded: true,
        currentlyLoaded: folioURL,
      });
      // this.forceUpdate();
    }, (error) => {
      console.log(`Unable to load transcription: ${error}`);
      // this.forceUpdate();
    });
  }

  // Refresh the content if there is an incoming change
  componentWillReceiveProps(nextProps) {
    this.contentChange = false;
    const nextFolioID = nextProps.documentView[this.props.side].iiifShortID;
    const nextFolioURL = DocumentHelper.folioURL(nextFolioID);
    if (this.state.currentlyLoaded !== nextFolioURL) {
      this.contentChange = true;
      this.loadFolio(DocumentHelper.getFolio(this.props.document, nextFolioURL));
    }
  }

  componentDidUpdate() {
    // TODO make this work for XML view

    if (this.contentChange) {
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
    const thisClass = `xmlViewComponent ${this.props.side}`;
    const thisID = `xmlViewComponent_${this.props.side}`;

    // Retrofit - the folios are loaded asynchronously
    const folioID = this.props.documentView[this.props.side].iiifShortID;
    const folioURL = DocumentHelper.folioURL(folioID);
    if (folioURL === '-1') {
      return (
        <div className="watermark">
          <div className="watermark_contents" />
        </div>
      );
    } if (!this.state.isLoaded) {
      this.loadFolio(DocumentHelper.getFolio(this.props.document, folioURL));
      return (
        <div className="watermark">
          <div className="watermark_contents" />
        </div>
      );
    }

    // get the xml for this transcription
    const { transcriptionType } = this.props.documentView[this.props.side];
    const xmlContent = this.state.folio.transcription[`${transcriptionType}_xml`];

    return (
      <div id={thisID} className={thisClass}>
        <Navigation side={this.props.side} documentView={this.props.documentView} documentViewActions={this.props.documentViewActions} />
        <div className="xmlContent">
          <Pagination side={this.props.side} className="pagination_upper" documentView={this.props.documentView} documentViewActions={this.props.documentViewActions} />

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
