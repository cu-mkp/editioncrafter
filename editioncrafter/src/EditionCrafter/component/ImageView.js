import Annotorious from '@recogito/annotorious-openseadragon'
import OpenSeadragon from 'openseadragon'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import TagFilterContext from '../context/TagFilterContext'
import ImageZoomControl from './ImageZoomControl'
import Navigation from './Navigation'

import { BigRingSpinner } from './RingSpinner'
import SeaDragonComponent from './SeaDragonComponent'
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css'

function ImageView(props) {
  const [viewer, setViewer] = useState(null)
  const [anno, setAnno] = useState(null)

  const { tags } = useContext(TagFilterContext)

  const location = useLocation()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const imageViewRef = useRef(null)

  const folio = props.document.folioIndex[props.folioID]

  const updateHighlightedZones = useCallback(() => {
    if (folio.zoneTagIndex && imageViewRef.current) {
      const annotationEls = imageViewRef.current.querySelectorAll('.a9s-annotation')
      const zonesToHighlight = Object.keys(folio.zoneTagIndex)
        .filter(zoneId => folio.zoneTagIndex[zoneId].some(tag => tags.includes(tag)))

      const manualSelection = searchParams.get('zone')

      if (manualSelection && !zonesToHighlight.includes(manualSelection)) {
        zonesToHighlight.push(manualSelection)
      }

      annotationEls.forEach((annoEl) => {
        const annoId = annoEl.getAttribute('data-id')
        if (zonesToHighlight.includes(annoId)) {
          annoEl.classList.add('selected')
        }
        else {
          annoEl.classList.remove('selected')
        }
      })
    }
  }, [folio, tags, imageViewRef, searchParams])

  useEffect(() => {
    setTimeout(() => updateHighlightedZones(), 50)
  }, [updateHighlightedZones])

  const onZoomGrid = () => {
    props.documentViewActions.changeTranscriptionType(props.side, 'g')
  }

  const onZoomFixed_1 = () => {
    viewer.viewport.zoomTo(viewer.viewport.getMaxZoom())
  }

  const onZoomFixed_2 = () => {
    viewer.viewport.zoomTo((viewer.viewport.getMaxZoom() / 2))
  }

  const onZoomFixed_3 = () => {
    viewer.viewport.fitVertically()
  }

  const onZoomIn = () => {
    viewer.viewport.zoomBy(2)
  }

  const onZoomOut = () => {
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
        updateHighlightedZones()
        navigate(`${location.pathname}?${createSearchParams(searchParams.toString())}`)
      })

      anno.on('cancelSelected', () => {
        searchParams.delete('zone')
        navigate(`${location.pathname}?${createSearchParams(searchParams.toString())}`)
      })
    }
  }, [searchParams, anno, updateHighlightedZones, folio, navigate, location.pathname])

  useEffect(() => {
    if (folio.tileSource && viewer) {
      viewer.open(folio.tileSource)
      if (folio.annotations && anno) {
        anno.setAnnotations(folio.annotations)
      }
    }
  }, [anno, viewer, folio, props.document.folioIndex])

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
  }, [viewer])

  return (
    <div ref={imageViewRef}>
      { folio.tileSource
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
                tileSource={folio.tileSource}
                initViewer={initViewer}
                loading={folio.loading}
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
