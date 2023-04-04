import OpenSeadragon from 'openseadragon';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import Navigation from './Navigation';
import ImageZoomControl from './ImageZoomControl';

import DocumentHelper from '../model/DocumentHelper';

class ImageView extends Component {
  constructor(props, context) {
    super(props, context);
    this.elementID = `image-view-seadragon-${this.props.side}`;
    this.onZoomFixed_1 = this.onZoomFixed_1.bind(this);
    this.onZoomFixed_2 = this.onZoomFixed_2.bind(this);
    this.onZoomFixed_3 = this.onZoomFixed_3.bind(this);

    this.state = {
      isLoaded: false,
      currentFolioID: '',
    };
  }

  // Refresh the content only if there is an incoming change
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { side, document } = this.props;
    const folioID = nextProps.documentView[side].iiifShortID;
    if (folioID) {
      if (folioID !== this.state.currentFolioID) {
        this.loadFolio(document.folioIndex[folioID]);
      }
    }
  }

  componentDidMount() {
    const { documentView, document } = this.props;

    const folioID = documentView[this.props.side].iiifShortID;
    if (folioID) {
      if (folioID !== this.state.currentFolioID) {
        this.loadFolio(document.folioIndex[folioID]);
      }
    }
  }

  loadFolio(thisFolio) {
    // window.loadingModal_start();
    this.setState({ ...this.state, currentFolioID: thisFolio.id });
    if (typeof this.viewer !== 'undefined') {
      this.viewer.destroy();
    }
    const in_id = `os-zoom-in ${this.props.side}`;
    const out_id = `os-zoom-out ${this.props.side}`;
    this.viewer = OpenSeadragon({
      id: this.elementID,
      zoomInButton: in_id,
      zoomOutButton: out_id,
      prefixUrl: './img/openseadragon/',
    });
    thisFolio.load().then(
      (folio) => {
        this.viewer.addTiledImage({
          tileSource: folio.tileSource,
        });
        this.setState({ ...this.state, isLoaded: true });
        // window.loadingModal_stop();
      },
      (error) => {
        // TODO update UI
        console.log(`Unable to load image: ${error}`);
      },
    );
  }

  onZoomGrid = (e) => {
    this.props.documentViewActions.changeTranscriptionType(this.props.side, 'g');
  };

  onZoomFixed_1 = (e) => {
    this.viewer.viewport.zoomTo(this.viewer.viewport.getMaxZoom());
  };

  onZoomFixed_2 = (e) => {
    this.viewer.viewport.zoomTo((this.viewer.viewport.getMaxZoom() / 2));
  };

  onZoomFixed_3 = (e) => {
    this.viewer.viewport.fitVertically();
  };

  render() {
    const thisClass = `image-view imageViewComponent ${this.props.side}`;
    return (
      <div>
        <div className={thisClass}>
          <Navigation side={this.props.side} documentView={this.props.documentView} documentViewActions={this.props.documentViewActions} />
          <ImageZoomControl
            side={this.props.side}
            documentView={this.props.documentView}
            onZoomFixed_1={this.onZoomFixed_1}
            onZoomFixed_2={this.onZoomFixed_2}
            onZoomFixed_3={this.onZoomFixed_3}
            onZoomGrid={this.onZoomGrid}
          />
          <div id={this.elementID} />
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

export default connect(mapStateToProps)(ImageView);
