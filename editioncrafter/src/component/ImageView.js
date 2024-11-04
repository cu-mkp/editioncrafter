import * as Annotorious from '@recogito/annotorious-openseadragon'
/* eslint-disable react-hooks/exhaustive-deps */
import OpenSeadragon from 'openseadragon'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import ImageZoomControl from './ImageZoomControl'
import Navigation from './Navigation'
import { BigRingSpinner } from './RingSpinner'

import SeaDragonComponent from './SeaDragonComponent'
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css'

function ImageView(props) {
  const [viewer, setViewer] = useState(null)
  const [anno, setAnno] = useState(null)

  // const [onZoomFixed_1, setOnZoomFixed_1] = useState(() => null);
  // const [onZoomFixed_2, setOnZoomFixed_2] = useState(() => null);
  // const [onZoomFixed_3, setOnZoomFixed_3] = useState(() => null);
  // const [onZoomOut, setOnZoomOut] = useState(() => null);
  // const [onZoomIn, setOnZoomIn] = useState(() => null);

  const location = useLocation()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (anno && searchParams.get('zone')) {
      // TODO: Figure out why annotations are an empty list
      // unless I wait for > 20 ms.
      setTimeout(() => anno.selectAnnotation(searchParams.get('zone')), 50)
    }
  }, [anno])

  const onZoomGrid = (e) => {
    props.documentViewActions.changeTranscriptionType(props.side, 'g')
  }

  const onZoomFixed_1 = (e) => {
    viewer.viewport.zoomTo(viewer.viewport.getMaxZoom())
  }

  const onZoomFixed_2 = (e) => {
    viewer.viewport.zoomTo((viewer.viewport.getMaxZoom() / 2))
  }

  const onZoomFixed_3 = (e) => {
    viewer.viewport.fitVertically()
  }

  const onZoomIn = (e) => {
    viewer.viewport.zoomBy(2)
  }

  const onZoomOut = (e) => {
    viewer.viewport.zoomBy(0.5)
  }

  useEffect(() => {
    if (anno) {
      // Note: The `on` method does NOT overwrite any previous handlers,
      // it just adds more! Debugging this took forever. Please do not
      // remove the `off` calls because otherwise the `on` callbacks
      // will just stack up forever!
      anno.off('selectAnnotation')
      anno.off('cancelSelected')

      // Another note for future developers: `location.pathname` is CACHED
      // when these callbacks are created. So if you create the callback,
      // changed the route, and then run the callback, it'll run with the
      // old path. So we need to watch the pathname and reset the callbacks
      // every time it changes!
      anno.on('selectAnnotation', (annotation) => {
        searchParams.set('zone', annotation.id)
        navigate(`${location.pathname}?${createSearchParams(searchParams.toString())}`)
      })

      anno.on('cancelSelected', () => {
        navigate(location.pathname)
      })
    }
  }, [location.pathname, anno])

  const initViewer = async (el, tileSource) => {
    if (!el) {
      setViewer(null)
      setAnno(null)
    }
    else {
      const newViewer = OpenSeadragon({
        element: el,
        showNavigationControl: false,
        zoomPerClick: 2,
        gestureSettingsMouse: {
          clickToZoom: false,
        },
      })

      setViewer(newViewer)

      const newAnno = Annotorious(newViewer, {})
      newAnno.disableEditor = true
      newAnno.readOnly = true

      setAnno(newAnno)

      newViewer.addTiledImage({
        tileSource,
      })
    }
  }

  // Cleanup callback to destroy the viewer on unmount
  useEffect(() => () => {
    if (viewer) {
      viewer.destroy()
    }
  }, [])

  const { tileSource } = props.document.folioIndex[props.folioID]

  useEffect(() => {
    const folio = props.document.folioIndex[props.folioID]
    if (folio.loading) {
      setLoading(true)
    }
    if (folio.tileSource && viewer) {
      viewer.open(folio.tileSource)
      if (folio.annotations && anno) {
        anno.setAnnotations(folio.annotations)
      }
    }
    if (!folio.loading) {
      setLoading(false)
    }
  }, [anno, viewer, props.folioID, props.document.folioIndex])

  return (
    <div>
      { tileSource
        ? (
            <div className={`image-view imageViewComponent ${props.side}`} style={{ position: 'relative' }}>
              <Navigation
                side={props.side}
                documentView={props.documentView}
                documentViewActions={props.documentViewActions}
                documentName={props.document.variorum && props.document.folioIndex[props.folioID].doc_id}
              />
              <ImageZoomControl
                side={props.side}
                documentView={props.documentView}
                onZoomFixed_1={onZoomFixed_1}
                onZoomFixed_2={onZoomFixed_2}
                onZoomFixed_3={onZoomFixed_3}
                onZoomGrid={onZoomGrid}
                onZoomIn={onZoomIn}
                onZoomOut={onZoomOut}
                viewer={viewer}
              />
              <SeaDragonComponent
                key={props.folioID}
                side={props.side}
                tileSource={tileSource}
                initViewer={initViewer}
                loading={loading}
              />
            </div>
          )
        : (
            <BigRingSpinner color="dark" delay={300} />
          )}
    </div>
  )
}

function mapStateToProps(state) {
  return {
    document: state.document,
  }
}

export default connect(mapStateToProps)(ImageView)
