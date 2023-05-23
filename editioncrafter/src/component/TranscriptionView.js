import React, { Component } from 'react';
import { connect } from 'react-redux';
import Parser from 'html-react-parser';
import Navigation from './Navigation';
import Pagination from './Pagination';
import EditorComment from './EditorComment';
import ErrorBoundary from './ErrorBoundary';
import Watermark from './Watermark';

class TranscriptionView extends Component {
  // Recursively unpack a node tree object and just return the text
  nodeTreeToString(node) {
    let term = '';
    for (let x = 0; x < node.length; x++) {
      if (node[x].type === 'text') {
        term += `${node[x].data} `;
      } else if (node[x].children.length > 0) {
        term += this.nodeTreeToString(node[x].children);
      }
    }
    return term.trim();
  }

  // RENDER
  render() {
    const {
      side, folioID, transcriptionType, document, documentView, documentViewActions,
    } = this.props;

    if (folioID === '-1') {
      return (
        <Watermark
          documentView={documentView}
          documentViewActions={documentViewActions}
          side={side}
        />
      );
    }

    const folio = document.folioIndex[folioID];
    if (!folio.transcription) {
      return (
        <Watermark
          documentView={documentView}
          documentViewActions={documentViewActions}
          side={side}
        />
      );
    }
    const transcriptionData = folio.transcription[transcriptionType];

    if (!transcriptionData) {
      return (
        <Watermark
          documentView={documentView}
          documentViewActions={documentViewActions}
          side={side}
        />
      );
    }

    // Configure parser to replace certain tags with components
    const htmlToReactParserOptionsSide = htmlToReactParserOptions();
    const { html, layout } = transcriptionData;

    if (!html) {
      return (
        <Watermark
          documentView={documentView}
          documentViewActions={documentViewActions}
          side={side}
        />
      );
    }

    const surfaceStyle = { gridTemplateAreas: layout };

    return (
      <div>
        <Navigation
          side={side}
          documentView={documentView}
          documentViewActions={documentViewActions}
        />
        <Pagination side={side} documentView={documentView} documentViewActions={documentViewActions} />
        <div className="transcriptionViewComponent">
          <div className="transcriptContent">
            <ErrorBoundary>
              <div
                className="surface grid-mode"
                style={surfaceStyle}
              >
                {Parser(html, htmlToReactParserOptionsSide)}
              </div>
            </ErrorBoundary>
          </div>
        </div>

        <Pagination
          side={side}
          documentView={documentView}
          documentViewActions={documentViewActions}
        />
      </div>
    );
  }
}

function htmlToReactParserOptions() {
  const parserOptions = {
    replace(domNode) {
      switch (domNode.name) {
        case 'tei-note': {
          const text = domNode.children[0]?.data || '';
          const id = domNode.attribs.n;

          // Not sure what else to do if there's no ID
          if (!id) {
            return domNode;
          }

          return (
            <EditorComment commentID={id} text={text} />
          );
        }
        case 'tei-figure': {
          const graphicEl = domNode.children.find(ch => ch.name === 'tei-graphic');
          const src = graphicEl?.attribs?.url;
          if (!src) {
            return domNode;
          }

          const descEl = domNode.children.find(ch => ch.name === 'tei-figdesc');
          const desc = descEl?.children[0]?.data;
          return (
            <figure className="inline-figure">
              <img src={src} alt={desc || ''} className="inline-image" />
              { desc ? <figcaption>{desc}</figcaption> : null }
            </figure>
          );
        }

        default:
          /* Otherwise, Just pass through */
          return domNode;
      }
    },
  };
  return parserOptions;
}

function mapStateToProps(state) {
  return {
    annotations: state.annotations,
    document: state.document,
  };
}

export default connect(mapStateToProps)(TranscriptionView);
