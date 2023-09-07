import React from 'react';
import { connect } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Navigation from './Navigation';
import Pagination from './Pagination';
import Parser from './Parser';
import EditorComment from './EditorComment';
import ErrorBoundary from './ErrorBoundary';
import Watermark from './Watermark';

const htmlToReactParserOptions = (selectedZone) => {
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

        case 'div': {
          if (selectedZone && domNode.attribs['data-facs']) {
            // The facs field can contain multiple values
            const facses = domNode.attribs['data-facs'].split(' ');

            if (facses.includes(selectedZone)) {
              // Keep any inline styles that might already be set
              const style = 'outline:2px solid #9c9100;';
              if (domNode.attribs.style) {
                domNode.attribs.style += style;
              } else {
                domNode.attribs.style = style;
              }
            }
          }

          return domNode;
        }

        default:
          /* Otherwise, Just pass through */
          return domNode;
      }
    },
  };
  return parserOptions;
};

const TranscriptionView = (props) => {
  const [searchParams] = useSearchParams();

  const {
    side, folioID, transcriptionType, document, documentView, documentViewActions,
  } = props;

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
  const htmlToReactParserOptionsSide = htmlToReactParserOptions(searchParams.get('zone'));
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
      />
    </div>
  );
};

function mapStateToProps(state) {
  return {
    annotations: state.annotations,
    document: state.document,
  };
}

export default connect(mapStateToProps)(TranscriptionView);
