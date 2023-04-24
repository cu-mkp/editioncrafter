import OpenSeadragon from 'openseadragon';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import Navigation from './Navigation';
import ImageZoomControl from './ImageZoomControl';
import { SeaDragonComponent } from './SeaDragonComponent';

class ImageView extends Component {

  initViewer = (el, tileSource) => {
    if( !el ) {
        this.viewer = null;
        return;
    }

    const in_id = `os-zoom-in ${this.props.side}`;
    const out_id = `os-zoom-out ${this.props.side}`;
    this.viewer = OpenSeadragon({
      element: el,
      zoomInButton: in_id,
      zoomOutButton: out_id,
      prefixUrl: './img/openseadragon/',
    });
    this.viewer.addTiledImage({
      tileSource,
    });  
  }

  componentDidUpdate(prevProps) {
    const { folioID: prevID } = prevProps
    const { folioID } = this.props
    if (prevID !== folioID) {
      const { document, folioID } = this.props;
      const folio = document.folioIndex[folioID];
      if( folio.tileSource && this.viewer ) {
        this.viewer.open(folio.tileSource);
      }
    }
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
    const { document, folioID, side } = this.props;
    const folio = document.folioIndex[folioID];
    // if( folio.loading ) {
    //   window.loadingModal_start();
    // } else {
    //   window.loadingModal_stop();
    // }
    return (
      <div>
        { folio.tileSource && 
          <div className={`image-view imageViewComponent ${this.props.side}`}>
            <Navigation side={this.props.side} documentView={this.props.documentView} documentViewActions={this.props.documentViewActions} />
            <ImageZoomControl
              side={this.props.side}
              documentView={this.props.documentView}
              onZoomFixed_1={this.onZoomFixed_1}
              onZoomFixed_2={this.onZoomFixed_2}
              onZoomFixed_3={this.onZoomFixed_3}
              onZoomGrid={this.onZoomGrid}
            />
            <SeaDragonComponent side={side} tileSource={folio.tileSource} initViewer={this.initViewer}></SeaDragonComponent> 
          </div> 
        }
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
