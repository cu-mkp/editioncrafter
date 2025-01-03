import React from 'react'
import { connect } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import EditorComment from './EditorComment'
import ErrorBoundary from './ErrorBoundary'
import Navigation from './Navigation'
import Pagination from './Pagination'
import Parser from './Parser'
import { BigRingSpinner } from './RingSpinner'
import Watermark from './Watermark'

function addZoneStyle(selectedZone, domNode, facses) {
  if (facses.includes(selectedZone)) {
    // Keep any classes that might already be set
    if (domNode.attribs.classname) {
      domNode.attribs.classname += ' selected-zone'
    }
    else {
      domNode.attribs.classname = 'selected-zone'
    }
  }

  return domNode
}

function setUpForZoneHighlighting(selectedZone, domNode) {
  if (selectedZone && domNode.attribs['data-facs']) {
    // The facs field can contain multiple values
    const facses = domNode.attribs['data-facs'].split(' ')

    return addZoneStyle(selectedZone, domNode, facses)
  }

  return domNode
}

function htmlToReactParserOptions(selectedZone) {
  const parserOptions = {
    replace(domNode) {
      switch (domNode.name) {
        case 'tei-line': {
          return setUpForZoneHighlighting(selectedZone, domNode)
        }
        case 'tei-surface': {
          return setUpForZoneHighlighting(selectedZone, domNode)
        }
        case 'tei-note': {
          const text = domNode.children[0]?.data || ''
          const id = domNode.attribs.n || domNode.attribs.id

          // Not sure what else to do if there's no ID
          if (!id) {
            return domNode
          }

          return (
            <EditorComment commentID={id} text={text} />
          )
        }
        case 'tei-figure': {
          const graphicEl = domNode.children.find(ch => ch.name === 'tei-graphic')
          const src = graphicEl?.attribs?.url
          if (!src) {
            return domNode
          }

          const descEl = domNode.children.find(ch => ch.name === 'tei-figdesc')
          const desc = descEl?.children[0]?.data
          return (
            <figure className="inline-figure">
              <img src={src} alt={desc || ''} className="inline-image" />
              { desc ? <figcaption>{desc}</figcaption> : null }
            </figure>
          )
        }

        case 'div': {
          return setUpForZoneHighlighting(selectedZone, domNode)
        }

        default:
          /* Otherwise, Just pass through */
          return domNode
      }
    },
  }
  return parserOptions
}

function TranscriptionView(props) {
  const [searchParams] = useSearchParams()

  const {
    side,
    folioID,
    transcriptionType,
    document,
    documentView,
    documentViewActions,
  } = props

  if (folioID === '-1') {
    return (
      <Watermark
        documentView={documentView}
        documentViewActions={documentViewActions}
        side={side}
      />
    )
  }

  const folio = document.folioIndex[folioID]

  if (folio && !folio.loading && !folio.transcription) {
    return (
      <Watermark
        documentView={documentView}
        documentViewActions={documentViewActions}
        side={side}
      />
    )
  }
  const transcriptionData = folio && folio.transcription && folio.transcription[transcriptionType]

  if (folio && !folio.loading && !transcriptionData) {
    return (
      <Watermark
        documentView={documentView}
        documentViewActions={documentViewActions}
        side={side}
      />
    )
  }

  // Configure parser to replace certain tags with components
  const htmlToReactParserOptionsSide = htmlToReactParserOptions(searchParams.get('zone'))
  const html = transcriptionData && transcriptionData.html
  const layout = transcriptionData && transcriptionData.layout

  if (folio && !folio.loading && !html) {
    return (
      <Watermark
        documentView={documentView}
        documentViewActions={documentViewActions}
        side={side}
      />
    )
  }

  if (folio && folio.loading) {
    return (
      <div>
        <Navigation
          side={side}
          documentView={documentView}
          documentViewActions={documentViewActions}
          documentName={document.variorum && folio.doc_id}
        />
        <Pagination side={side} documentView={documentView} documentViewActions={documentViewActions} />
        <div className="transcriptionViewComponent">
          <div className="transcriptContent">
            <ErrorBoundary>
              <BigRingSpinner delay={3000} color="dark" />
            </ErrorBoundary>
          </div>
        </div>

        <Pagination
          side={side}
          documentView={documentView}
          documentViewActions={documentViewActions}
          bottom
        />
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', overflow: 'auto' }}>
      <Navigation
        side={side}
        documentView={documentView}
        documentViewActions={documentViewActions}
        documentName={document.variorum && folio.doc_id}
      />
      <Pagination side={side} documentView={documentView} documentViewActions={documentViewActions} />
      <div className="transcriptionViewComponent">
        <div className="transcriptContent">
          <ErrorBoundary>
            <div
              className="surface grid-mode"
              style={{ gridTemplateAreas: layout }}
            >
              <Parser
                html={html}
                htmlToReactParserOptionsSide={htmlToReactParserOptionsSide}
              />
            </div>
          </ErrorBoundary>
        </div>
      </div>

      <Pagination
        side={side}
        documentView={documentView}
        documentViewActions={documentViewActions}
        bottom
      />
    </div>
  )
}

function mapStateToProps(state) {
  return {
    annotations: state.annotations,
    document: state.document,
  }
}

export default connect(mapStateToProps)(TranscriptionView)
