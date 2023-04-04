import React, { Component } from 'react';
import { connect } from 'react-redux';
import Parser, { domToReact } from 'html-react-parser';
import Navigation from './Navigation';
import Pagination from './Pagination';
import EditorComment from './EditorComment';
import DocumentHelper from '../model/DocumentHelper';
import ErrorBoundary from './ErrorBoundary';
import { layoutMargin3, layoutMargin4, layoutGrid } from '../model/folioLayout';

class TranscriptionView extends Component {
  constructor(props) {
    super(props);
    this.state = { folio: [], isLoaded: false, currentlyLoaded: '' };
    this.contentChange = true;
    // window.loadingModal_stop();
  }

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

  loadFolio(folio) {
    const { side, documentView } = this.props;
    if (typeof folio === 'undefined') {
      // console.log("TranscriptView: Folio is undefined when you called loadFolio()!");
      return;
    }
    folio.load().then((folio) => {
      const folioID = documentView[side].iiifShortID;
      this.setState({
        folio,
        isLoaded: true,
        currentlyLoaded: folioID,
      });
    }, (error) => {
      console.log(`Unable to load transcription: ${error}`);
    });
  }

  // Refresh the content if there is an incoming change
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.contentChange = false;
    const nextfolioID = nextProps.documentView[this.props.side].iiifShortID;
    if (this.state.currentlyLoaded !== nextfolioID) {
      this.contentChange = true;
      this.loadFolio(DocumentHelper.getFolio(this.props.document, nextfolioID));
    }
  }

  componentDidUpdate() {
    if (this.contentChange) {
      // Scroll content to top
      const selector = `transcriptionViewComponent_${this.props.side}`;
      const el = document.getElementById(selector);
      if (el !== null) {
        // console.log(selector + "scroll to top");
        el.scrollTop = 0;
      }
    }
  }

  getTranscriptionData(transcription) {
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

  // RENDER
  render() {
    const {
      side, document, documentView, documentViewActions,
    } = this.props;

    // Retrofit - the folios are loaded asynchronously
    const folioID = documentView[side].iiifShortID;
    if (folioID === '-1') {
      return watermark();
    } if (!this.state.isLoaded) {
      this.loadFolio(DocumentHelper.getFolio(document, folioID));
      return watermark();
    }

    const transcriptionData = this.getTranscriptionData(this.state.folio.transcription[documentView[side].transcriptionType]);

    if (!transcriptionData) {
      console.log(`Undefined transcription for side: ${side}`);
      return watermark();
    }

    // Determine class and id for this component
    if (transcriptionData.content.length !== 0) {
      let surfaceClass = 'surface';
      const surfaceStyle = {};
      // Handle grid mode
      const { isGridMode } = documentView[side];
      if (isGridMode) {
        surfaceClass += ' grid-mode';
        surfaceStyle.gridTemplateAreas = transcriptionData.layout;
      }

      // Configure parser to replace certain tags with components
      const htmlToReactParserOptionsSide = htmlToReactParserOptions(side);

      const { content } = transcriptionData;

      return (
      // Render the transcription

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
                  className={surfaceClass}
                  style={surfaceStyle}
                >

                  {Parser(content, htmlToReactParserOptionsSide)}
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
    // Empty content
    return (
      <div>
        <Navigation side={side} documentView={documentView} documentViewActions={documentViewActions} />
        <div className="transcriptContent">
          <Pagination side={side} className="pagination_upper" documentView={documentView} documentViewActions={documentViewActions} />
          { watermark() }
        </div>
      </div>
    );
  }
}

function htmlToReactParserOptions(side) {
  const parserOptions = {
    replace(domNode) {
      switch (domNode.name) {
        case 'add':
          return (
            <span className="add">
              {domToReact(domNode.children, parserOptions)}
            </span>
          );

        case 'del':
          return (
            <s className="del">
              {domToReact(domNode.children, parserOptions)}
            </s>
          );

        case 'comment':
          const commentID = domNode.attribs.rid; // ( domNode.children && domNode.children[0] ) ? domNode.children[0].data : null
          return (
            <EditorComment commentID={commentID} />
          );

        case 'corr':
          return (
            <span className="corr">
              &#91;
              {domToReact(domNode.children, parserOptions)}
              &#93;
            </span>
          );

        case 'superscript':
          return (
            <sup>{domToReact(domNode.children, parserOptions)}</sup>
          );

        case 'de':
        case 'el':
        case 'es':
        case 'fr':
        case 'it':
        case 'la':
          return (
            <i>
              {domToReact(domNode.children, parserOptions)}
            </i>
          );

        case 'exp':
          return (
            <span className="exp">
              &#123;
              {domToReact(domNode.children, parserOptions)}
              &#125;
            </span>
          );

        case 'underline':
          return (
            <u>{domToReact(domNode.children, parserOptions)}</u>
          );

        case 'unc':
          return (
            <span>
              [
              {domToReact(domNode.children, parserOptions)}
              ?]
            </span>
          );

        case 'sup':
          return (
            <span />
          );

        case 'lb':
          return (
            <br />
          );

        case 'gap':
          return (
            <i>[gap]</i>
          );

        case 'ill':
          return (
            <i>[illegible]</i>
          );

        case 'ups':
          return (
            <span className="ups">{domToReact(domNode.children, parserOptions)}</span>
          );

        case 'al':
        case 'bp':
        case 'cn':
        case 'df':
        case 'env':
        case 'm':
        case 'mark':
        case 'md':
        case 'ms':
        case 'mu':
        case 'pa':
        case 'pl':
        case 'pn':
        case 'pro':
        case 'sn':
        case 'tl':
        case 'tmp':
        case 'wp':
          return (
            <span>{domToReact(domNode.children, parserOptions)}</span>
          );

        case 'emph':
        case 'man':
        case 'rub':
          return (
            <b>
              {domToReact(domNode.children, parserOptions)}
            </b>
          );

        default:
          /* Otherwise, Just pass through */
          return domNode;
      }
    },
  };
  return parserOptions;
}

function watermark() {
  return (
    <div className="watermark">
      <div className="watermark_contents" />
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
