import React, { Component } from 'react';
import { connect } from 'react-redux';
import Parser from 'html-react-parser';
import Navigation from './Navigation';
import Pagination from './Pagination';
import EditorComment from './EditorComment';
import ErrorBoundary from './ErrorBoundary';
import { layoutMargin3, layoutMargin4, layoutGrid } from '../model/folioLayout';

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
      return watermark(documentView, documentViewActions, side);
    }

    const folio = document.folioIndex[folioID];
    const transcriptionData = folio.transcription[transcriptionType];
    console.log('rendering ', transcriptionData)

    if (!transcriptionData) {
      return watermark(documentView, documentViewActions, side);
    }

    // Configure parser to replace certain tags with components
    const htmlToReactParserOptionsSide = htmlToReactParserOptions();
    const { html, layout } = transcriptionData;
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
                className='surface grid-mode'
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

function getTranscriptionData(transcription) {
  if (typeof transcription === 'undefined') return null;

  // Grid layout
  if (transcription.layout === 'grid') {
    return layoutGrid(transcription.html);

    // Margin layout
  } if (transcription.layout === 'three-column') {
    return layoutMargin3(transcription.html);
  } if (transcription.layout === 'four-column') {
    return layoutMargin4(transcription.html);

    // None specified, pass on without any layout
  }
  return {
    content: transcription.html,
    layout: '',
  };
}

function htmlToReactParserOptions() {
  const parserOptions = {
    replace(domNode) {
      switch (domNode.name) {
        case 'comment': {
          const commentID = domNode.attribs.rid; // ( domNode.children && domNode.children[0] ) ? domNode.children[0].data : null
          return (
            <EditorComment commentID={commentID} />
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

function watermark(documentView, documentViewActions, side) {
  return (
    <div>
        <Navigation side={side} documentView={documentView} documentViewActions={documentViewActions} />
        <div className="transcriptContent">
          <Pagination side={side} className="pagination_upper" documentView={documentView} documentViewActions={documentViewActions} />
          <div className="watermark">
            <div className="watermark_contents" />
          </div>
        </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    annotations: state.annotations,
    document: state.document,
  };
}

export default connect(mapStateToProps)(TranscriptionView);
