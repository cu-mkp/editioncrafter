import React, { Component } from 'react';
import { connect } from 'react-redux';
import Parser from 'html-react-parser';
import domToReact from 'html-react-parser/lib/dom-to-react';
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
    if (typeof folio === 'undefined') {
      // console.log("TranscriptView: Folio is undefined when you called loadFolio()!");
      return;
    }
    folio.load().then((folio) => {
      const folioID = this.props.documentView[this.props.side].iiifShortID;
      const folioURL = DocumentHelper.folioURL(folioID);
      this.setState({
        folio,
        isLoaded: true,
        currentlyLoaded: folioURL,
      });
    }, (error) => {
      console.log(`Unable to load transcription: ${error}`);
    });
  }

  	// Refresh the content if there is an incoming change
  componentWillReceiveProps(nextProps) {
    this.contentChange = false;
    const nextfolioID = nextProps.documentView[this.props.side].iiifShortID;
    const nextfolioURL = DocumentHelper.folioURL(nextfolioID);
  		if (this.state.currentlyLoaded !== nextfolioURL) {
      this.contentChange = true;
      this.loadFolio(DocumentHelper.getFolio(this.props.document, nextfolioURL));
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

  watermark() {
    return (
      <div className="watermark">
        <div className="watermark_contents" />
      </div>
    );
  }

  htmlToReactParserOptions(side) {
    const this2 = this;
    var parserOptions = {
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
    // Retrofit - the folios are loaded asynchronously
    const folioID = this.props.documentView[this.props.side].iiifShortID;
    if (folioID === '-1') {
      return this.watermark();
    } if (!this.state.isLoaded) {
      const folioURL = DocumentHelper.folioURL(folioID);
      this.loadFolio(DocumentHelper.getFolio(this.props.document, folioURL));
      return this.watermark();
    }

    const transcriptionData = this.getTranscriptionData(this.state.folio.transcription[this.props.documentView[this.props.side].transcriptionType]);

    if (!transcriptionData) {
      console.log(`Undefined transcription for side: ${this.props.side}`);
      return this.watermark();
    }

    // Determine class and id for this component
    const { side } = this.props;

    if (transcriptionData.content.length !== 0) {
      let surfaceClass = 'surface';
      const surfaceStyle = {};
      // Handle grid mode
      const isGridMode = (this.props.documentView.inSearchMode) ? true : this.props.documentView[this.props.side].isGridMode;
      if (isGridMode) {
        surfaceClass += ' grid-mode';
        surfaceStyle.gridTemplateAreas = transcriptionData.layout;
      }

      // Configure parser to replace certain tags with components
      const htmlToReactParserOptions = this.htmlToReactParserOptions(side);

      let { content } = transcriptionData;
      const { transcriptionType } = this.props.documentView[side];

      // Mark any found search terms
      if (this.props.documentView.inSearchMode) {
        const searchResults = this.props.search.results[transcriptionType];
        const folioName = this.props.document.folioNameByIDIndex[folioID];
        const properFolioName = DocumentHelper.generateFolioID(folioName);
        content = this.props.search.index.markMatchedTerms(searchResults, 'folio', properFolioName, content);
      }

      return (
      // Render the transcription

        <div>
          <Navigation
            side={side}
            documentView={this.props.documentView}
            documentViewActions={this.props.documentViewActions}
          />
          <Pagination side={side} documentView={this.props.documentView} documentViewActions={this.props.documentViewActions} />
          <div className="transcriptionViewComponent">
            <div className="transcriptContent">
              <ErrorBoundary>
                <div
                  className={surfaceClass}
                  style={surfaceStyle}
                >

                  {Parser(content, htmlToReactParserOptions)}
                </div>
              </ErrorBoundary>
            </div>
          </div>

          <Pagination
            side={side}
            documentView={this.props.documentView}
            documentViewActions={this.props.documentViewActions}
          />

        </div>
      );
    }
    // Empty content
    return (
      <div>
        <Navigation side={side} documentView={this.props.documentView} documentViewActions={this.props.documentViewActions} />
        <div className="transcriptContent">
          <Pagination side={side} className="pagination_upper" documentView={this.props.documentView} documentViewActions={this.props.documentViewActions} />
          { this.watermark() }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    annotations: state.annotations,
    document: state.document,
    search: state.search,
  };
}

export default connect(mapStateToProps)(TranscriptionView);
