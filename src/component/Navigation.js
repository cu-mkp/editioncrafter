import React from 'react';
import { connect } from 'react-redux';
import { Icon } from 'react-font-awesome-5';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import JumpToFolio from './JumpToFolio';
import DocumentHelper from '../model/DocumentHelper';
import HelpPopper from './HelpPopper';
import AlphabetLinks from './AlphabetLinks';

class Navigation extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.changeType = this.changeType.bind(this);
    this.revealJumpBox = this.revealJumpBox.bind(this);
    this.onJumpBoxBlur = this.onJumpBoxBlur.bind(this);
    this.toggleLockmode = this.toggleLockmode.bind(this);
    this.toggleBookmode = this.toggleBookmode.bind(this);
    this.toggleXMLMode = this.toggleXMLMode.bind(this);
    this.toggleColumns = this.toggleColumns.bind(this);
    this.changeCurrentFolio = this.changeCurrentFolio.bind(this);
    this.helpRef = null;
    this.state = {
      popoverVisible: false,
      popoverX: -1,
      popoverY: -1,
      openHelp: false,
    };
  }

  onJumpBoxBlur = function onJumpBoxBlur(event) {
    this.setState({ popoverVisible: false });
  };

  changeType = (event) => {
    if (event.target.value === undefined) return;
    this.props.documentViewActions.changeTranscriptionType(
      this.props.side,
      event.target.value,
    );
  };

  toggleHelp = (event) => {
    this.setState({
      openHelp: !this.state.openHelp,
    });
  };

  toggleBookmode = function toggleBookmode(event) {
    if (!this.props.documentView.bookMode === true) {
      this.props.documentViewActions.changeCurrentFolio(
        this.props.documentView.left.iiifShortID,
        'left',
        this.props.documentView.left.transcriptionType,
      );

      this.props.documentViewActions.changeCurrentFolio(
        this.props.documentView.left.nextFolioShortID,
        'right',
        this.props.documentView.left.transcriptionType,
      );
    }

    this.props.documentViewActions.setBookMode(
      this.props.documentView.left.iiifShortID,
      !this.props.documentView.bookMode,
    );
  };

  toggleXMLMode = function toggleXMLMode(event) {
    if (this.props.documentView.inSearchMode) {
      this.props.documentViewActions.toggleXMLMode();
    } else {
      this.props.documentViewActions.setXMLMode(
        this.props.side,
        !this.props.documentView[this.props.side].isXMLMode,
      );
    }
  };

  // aka gridMode
  toggleColumns = function toggleColumns(event) {
    this.props.documentViewActions.setGridMode(
      this.props.side,
      !this.props.documentView[this.props.side].isGridMode,
    );
  };

  toggleLockmode = function toggleLockmode(event) {
    if (this.props.documentView.bookMode) {
      this.toggleBookmode();
      return;
    }

    // If we are transitioning from unlocked to locked, synch up the panes
    if (this.props.documentView.linkedMode === false) {
      if (this.props.side === 'left') {
        this.props.documentViewActions.changeCurrentFolio(
          this.props.documentView.left.iiifShortID,
          'right',
          this.props.documentView.right.transcriptionType,
        );
      } else {
        this.props.documentViewActions.changeCurrentFolio(
          this.props.documentView.right.iiifShortID,
          'left',
          this.props.documentView.left.transcriptionType,
        );
      }
    }

    // Set lock
    this.props.documentViewActions.setLinkedMode(
      !this.props.documentView.linkedMode,
    );
  };

  changeCurrentFolio = (event) => {
    const {
      documentViewActions, documentView, side,
    } = this.props;

    if (typeof event.currentTarget.dataset.id === 'undefined' || event.currentTarget.dataset.id.length === 0) {
      return;
    }
    const folioID = event.currentTarget.dataset.id;
    documentViewActions.changeCurrentFolio(
      folioID,
      side,
      documentView[side].transcriptionType,
    );
  };

  revealJumpBox = function revealJumpBox(event) {
    this.setState({
      popoverVisible: true,
      popoverX: event.clientX,
      popoverY: event.clientY,
    });
  };

  render() {
    const { side, document, documentView, documentViewActions, onFilterChange } = this.props;

    if (!documentView) {
      return (
        <div>
          Unknown Transcription Type
        </div>
      );
    }

    const recommendedWidth = (documentView[side].width - 8);// the divder is 16 px wide so each side is minus 8
    const widthStyle = { width: recommendedWidth, maxWidth: recommendedWidth };
    const selectContainerStyle = (isWidthUp('md', this.props.width))
      ? ((documentView[side].width < 500) ? { display: 'none' } : { display: 'flex' })
      : {};
    const selectColorStyle = documentView[side].transcriptionType === 'f' ? { color: 'white' } : { color: 'black' };
    const selectClass = documentView[side].transcriptionType === 'f' ? 'dark' : 'light';
    const showButtonsStyle = documentView[side].transcriptionType === 'glossary' ? { visibility: 'hidden' } : { visibility: 'visible' };
    let lockIconClass = (documentView.linkedMode) ? 'fa fa-lock' : 'fa fa-lock-open';
    if (!documentView.bookMode) {
      lockIconClass += ' active';
    }
    const imageViewActive = documentView[side].transcriptionType === 'f';
    const bookIconClass = (documentView.bookMode) ? 'fa fa-book active' : 'fa fa-book';
    const xmlIconClass = (documentView[side].isXMLMode) ? 'fa fa-code active' : 'fa fa-code';
    // let columnIconClass = (documentView[side].isGridMode)?'fa fa-columns active':'fa fa-columns';
    //       columnIconClass += (imageViewActive)?' hidden':'';
    const folioName = document.folioIndex[documentView[side].iiifShortID]?.name;
    const jumpToIconStyle = (imageViewActive) ? { color: 'white' } : { color: 'black' };
    // this is messy but faster for the moment then figuring out why the sides dont behave the same
    const helpMarginStyle = side === 'left' ? { marginRight: '55px' } : { marginRight: '15px' };

    return (
      <div className="navigationComponent" style={widthStyle}>
        <div id="navigation-row" className="navigationRow">

          { documentView[side].transcriptionType !== 'glossary' ? (

            <div id="tool-bar-buttons" className="breadcrumbs" style={showButtonsStyle}>
              <span
                title="Toggle coordination of views"
                onClick={this.toggleLockmode}
                className={lockIconClass}
              />
                                                &nbsp;
              <span
                title="Toggle book mode"
                onClick={this.toggleBookmode}
                className={bookIconClass}
              />
                                                &nbsp;
              <span
                title="Toggle XML mode"
                onClick={this.toggleXMLMode}
                className={imageViewActive ? 'invisible' : xmlIconClass}
              />
                                                &nbsp;
              {/* <span title="Toggle single column mode"  onClick={this.toggleColumns}
                                                      className={columnIconClass}></span> */}
                                                &nbsp;
              <span
                title="Go back"
                onClick={this.changeCurrentFolio}
                data-id={documentView[side].previousFolioShortID}
                className={(documentView[side].hasPrevious) ? 'arrow' : 'arrow disabled'}
              >
                {' '}
                <Icon.ArrowCircleLeft />
                {' '}

              </span>

              <span
                title="Go forward"
                onClick={this.changeCurrentFolio}
                data-id={documentView[side].nextFolioShortID}
                className={(documentView[side].hasNext) ? 'arrow' : 'arrow disabled'}
              >
                {' '}
                <Icon.ArrowCircleRight />
              </span>
                                                &nbsp;&nbsp;
              {documentView[side].currentDocumentName}
              {' '}
              / Folios /
              <div
                onClick={this.revealJumpBox}
                className="folioName"
              >
                {folioName}
                {' '}
                <span style={jumpToIconStyle} className="fa fa-hand-point-right" />
              </div>

              <JumpToFolio
                side={side}
                isVisible={this.state.popoverVisible}
                positionX={this.state.popoverX}
                positionY={this.state.popoverY}
                submitHandler={documentViewActions.jumpToFolio}
                blurHandler={this.onJumpBoxBlur}
              />

            </div>
          )
            : (<AlphabetLinks onFilterChange={onFilterChange} value={this.props.value} />)}

          <div id="doc-type-help" style={selectContainerStyle} ref={e => { this.helpRef = e; }}>
            <Select
              className={selectClass}
              style={{ ...selectColorStyle, marginRight: 15 }}
              value={documentView[side].transcriptionType}
              id="doc-type"
              onClick={this.changeType}
            >
              <MenuItem value="tl">{DocumentHelper.transcriptionTypeLabels.tl}</MenuItem>
              <MenuItem value="tc">{DocumentHelper.transcriptionTypeLabels.tc}</MenuItem>
              <MenuItem value="tcn">{DocumentHelper.transcriptionTypeLabels.tcn}</MenuItem>
              <MenuItem value="f">{DocumentHelper.transcriptionTypeLabels.f}</MenuItem>
              <MenuItem value="glossary">{DocumentHelper.transcriptionTypeLabels.glossary}</MenuItem>
            </Select>
            <span
              title="Toggle folio help"
              onClick={this.toggleHelp}
              className="helpIcon"
            >
              <i className="fas fa-question-circle" />
            </span>
            <HelpPopper marginStyle={helpMarginStyle} anchorEl={this.helpRef} open={this.state.openHelp} onClose={this.toggleHelp} />
          </div>

        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    document: state.document,
  };
}

export default withWidth()(connect(mapStateToProps)(Navigation));
