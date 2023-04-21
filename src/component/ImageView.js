import OpenSeadragon from 'openseadragon';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import Navigation from './Navigation';
import ImageZoomControl from './ImageZoomControl';
import { SeaDragonComponent } from './SeaDragonComponent';

class ImageView extends Component {
  constructor(props) {
    super(props);
    // this.onZoomFixed_1 = this.onZoomFixed_1.bind(this);
    // this.onZoomFixed_2 = this.onZoomFixed_2.bind(this);
    // this.onZoomFixed_3 = this.onZoomFixed_3.bind(this);
    this.viewer = null;
  }

  initViewer = (el) => {
    if( !el ) {
        this.viewer = null;
        return;
    }

    const { document, folioID } = this.props;
    const folio = document.folioIndex[folioID];

    if( !this.viewer && folio.tileSource ) {
      const in_id = `os-zoom-in ${this.props.side}`;
      const out_id = `os-zoom-out ${this.props.side}`;
      this.viewer = OpenSeadragon({
        element: el,
        zoomInButton: in_id,
        zoomOutButton: out_id,
        prefixUrl: './img/openseadragon/',
      });
      this.viewer.addTiledImage({
        tileSource: folio.tileSource,
      });  
    }
  }

  // loadFolio(folio) {
  //   if( folio.loading ) {
  //     window.loadingModal_start();
  //     return 
  //   }

  //   }
  //   // if (typeof this.viewer !== 'undefined') {
  //   //   this.viewer.destroy();
  //   // }
  //   window.loadingModal_stop();
  // }

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
          <SeaDragonComponent initViewer={this.initViewer}></SeaDragonComponent>
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
