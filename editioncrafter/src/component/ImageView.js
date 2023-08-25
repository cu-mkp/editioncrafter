import OpenSeadragon from 'openseadragon';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import * as Annotorious from '@recogito/annotorious-openseadragon';
import Navigation from './Navigation';
import ImageZoomControl from './ImageZoomControl';
import { SeaDragonComponent } from './SeaDragonComponent';

import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';

const ImageView = (props) => {
  const [viewer, setViewer] = useState(null);
  const [anno, setAnno] = useState(null);

  useEffect(() => {
    if (anno && searchParams.get('zone')) {
      // TODO: Figure out why annotations are an empty list
      // unless I wait for > 20 ms.
      setTimeout(() => anno.selectAnnotation(searchParams.get('zone')), 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anno]);

  const [searchParams, setSearchParams] = useSearchParams();

  const onZoomGrid = (e) => {
    props.documentViewActions.changeTranscriptionType(props.side, 'g');
  };

  const onZoomFixed_1 = (e) => {
    viewer.viewport.zoomTo(viewer.viewport.getMaxZoom());
  };

  const onZoomFixed_2 = (e) => {
    viewer.viewport.zoomTo((viewer.viewport.getMaxZoom() / 2));
  };

  const onZoomFixed_3 = (e) => {
    viewer.viewport.fitVertically();
  };

  const initViewer = async (el, tileSource) => {
    if (!el) {
      setViewer(null);
      setAnno(null);
    } else {
      const in_id = `os-zoom-in ${props.side}`;
      const out_id = `os-zoom-out ${props.side}`;

      const newViewer = OpenSeadragon({
        element: el,
        zoomInButton: in_id,
        zoomOutButton: out_id,
        prefixUrl: './img/openseadragon/',
        zoomPerClick: 1,
      });

      setViewer(newViewer);

      const newAnno = Annotorious(newViewer, {});
      newAnno.disableEditor = true;
      newAnno.readOnly = true;

      newAnno.on('selectAnnotation', async (annotation) => {
        searchParams.set('zone', annotation.id);
        setSearchParams(searchParams);
      });

      newAnno.on('cancelSelected', async () => {
        searchParams.delete('zone');
        setSearchParams(searchParams);
      });

      setAnno(newAnno);

      newViewer.addTiledImage({
        tileSource,
      });
    }
  };

  // Cleanup callback to destroy the viewer on unmount
  useEffect(() => () => {
    if (viewer) {
      viewer.destroy();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { tileSource } = props.document.folioIndex[props.folioID];

  useEffect(() => {
    const folio = props.document.folioIndex[props.folioID];
    if (folio.tileSource && viewer) {
      viewer.open(folio.tileSource);
      if (folio.annotations && anno) {
        anno.setAnnotations(folio.annotations);
      }
    }
  }, [anno, viewer, props.folioID, props.document.folioIndex]);

  return (
    <div>
      { tileSource
      && (
      <div className={`image-view imageViewComponent ${props.side}`}>
        <Navigation
          side={props.side}
          documentView={props.documentView}
          documentViewActions={props.documentViewActions}
        />
        <ImageZoomControl
          side={props.side}
          documentView={props.documentView}
          onZoomFixed_1={onZoomFixed_1}
          onZoomFixed_2={onZoomFixed_2}
          onZoomFixed_3={onZoomFixed_3}
          onZoomGrid={onZoomGrid}
        />
        <SeaDragonComponent
          key={props.folioID}
          side={props.side}
          tileSource={tileSource}
          initViewer={initViewer}
        />
      </div>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    document: state.document,
  };
}

export default connect(mapStateToProps)(ImageView);
