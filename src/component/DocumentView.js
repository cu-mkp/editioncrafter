import React, { Component } from 'react';
import { connect } from 'react-redux';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import SplitPaneView from './SplitPaneView';
import { dispatchAction } from '../model/ReduxStore';
import ImageView from './ImageView';
import ImageGridView from './ImageGridView';
import TranscriptionView from './TranscriptionView';
import XMLView from './XMLView';
import GlossaryView from './GlossaryView';
import SinglePaneView from './SinglePaneView';

class DocumentView extends Component {
  constructor(props) {
    super(props);

    const paneDefaults = {
      isXMLMode: false,
      isGridMode: true,
      width: 0,
    };

    this.state = {
      linkedMode: true,
      bookMode: false,
      left: {
        ...paneDefaults,
      },
      right: {
        ...paneDefaults,
      },
    };

    this.documentViewActions = {
      setXMLMode: this.setXMLMode.bind(this),
      setLinkedMode: this.setLinkedMode.bind(this),
      setBookMode: this.setBookMode.bind(this),
      setGridMode: this.setGridMode.bind(this),
      changeTranscriptionType: this.changeTranscriptionType.bind(this),
      changeCurrentFolio: this.changeCurrentFolio.bind(this),
      jumpToFolio: this.jumpToFolio.bind(this),
    };
  }

  componentDidMount() {
    dispatchAction(this.props, 'DiplomaticActions.setFixedFrameMode', true);
  }

  setXMLMode(side, xmlMode) {
    this.setState((state) => {
      const nextState = { ...state };
      nextState[side].isXMLMode = xmlMode;
      return nextState;
    });
  }

  setLinkedMode(linkedMode) {
    this.setState((state) => ({ ...state, linkedMode }));
  }

  setBookMode(shortid, bookMode) {
    this.setState((state) => ({ ...state, bookMode }));

    if (bookMode) {
      const [versoID, rectoID] = this.findBookFolios(shortid);
      this.navigateFolios(versoID, 'f', rectoID, 'f');
    }
  }

  jumpToFolio(folioName, side) {
    const { document, viewports } = this.props;
    // Convert folioName to ID (and confirm it exists)
    if (document.folioByName[folioName]) {
      const folioID = document.folioByName[folioName]?.id;
      this.changeCurrentFolio(folioID, side, viewports[side].transcriptionType);
    }
  }

  findBookFolios(shortID) {
    const { document } = this.props;

    const versoFolio = document.folioNameByIDIndex[shortID];
    let versoIndex = document.folioIndex.indexOf(shortID);

    if (!versoFolio.endsWith('v')) {
      if (versoFolio.endsWith('r')) {
        versoIndex -= 1;
      } else {
        return [null, null];
      }
    }

    const rectoIndex = versoIndex + 1;
    return [document.folioIndex[versoIndex], document.folioIndex[rectoIndex]];
  }

  onWidth = (left, right) => {
    this.setState((state) => {
      const nextState = { ...state };
      nextState.left.width = left;
      nextState.right.width = right;
      return nextState;
    });
  };

  setGridMode(side, newState) {
    this.setState((state) => {
      const nextState = { ...state };
      nextState[side].isGridMode = newState;
      return nextState;
    });
  }

  changeTranscriptionType(side, transcriptionType) {
    if (side === 'left') {
      const { folioID } = this.props.viewports.left;
      const otherSide = this.props.viewports.right;
      this.navigateFolios(
        folioID,
        transcriptionType,
        otherSide.folioID,
        otherSide.transcriptionType,
      );
    } else {
      const { folioID } = this.props.viewports.right;
      const otherSide = this.props.viewports.left;
      this.navigateFolios(
        otherSide.folioID,
        otherSide.transcriptionType,
        folioID,
        transcriptionType,
      );
    }
  }

  navigateFolios(folioID, transcriptionType, folioID2, transcriptionType2) {
    if (!folioID) {
      // goto grid view
      this.props.history.push('/ec');
      return;
    }
    if (!transcriptionType) {
      // goto folioID, tc
      this.props.history.push(`/ec/${folioID}`);
      return;
    }
    if (!folioID2) {
      // goto folioID, transcriptionType
      this.props.history.push(`/ec/${folioID}/${transcriptionType}`);
      return;
    }
    if (!transcriptionType2) {
      // goto folioID, transcriptionType, folioID2, tc
      this.props.history.push(`/ec/${folioID}/${transcriptionType}/${folioID2}/tc`);
      return;
    }
    // goto folioID, transcriptionType, folioID2, transcriptionType2
    this.props.history.push(`/ec/${folioID}/${transcriptionType}/${folioID2}/${transcriptionType2}`);
  }

  changeCurrentFolio(folioID, side, transcriptionType) {
    // Lookup prev/next

    if (this.state.bookMode) {
      const [versoID, rectoID] = this.findBookFolios(folioID);
      if (versoID) {
        this.navigateFolios(versoID, 'f', rectoID, 'f');
      }
    } else if (this.state.linkedMode) {
      if (side === 'left') {
        const otherSide = this.props.viewports.right;
        this.navigateFolios(
          folioID,
          transcriptionType,
          folioID,
          otherSide.transcriptionType,
        );
      } else {
        const otherSide = this.props.viewports.left;
        this.navigateFolios(
          folioID,
          otherSide.transcriptionType,
          folioID,
          transcriptionType,
        );
      }
    } else if (side === 'left') {
      const otherSide = this.props.viewports.right;
      this.navigateFolios(
        folioID,
        transcriptionType,
        otherSide.folioID,
        otherSide.transcriptionType,
      );
    } else {
      const otherSide = this.props.viewports.left;
      this.navigateFolios(
        otherSide.folioID,
        otherSide.transcriptionType,
        folioID,
        transcriptionType,
      );
    }
  }

  determineViewType(side) {
    const { transcriptionType } = this.props.viewports[side];
    const xmlMode = this.state[side].isXMLMode;

    if (transcriptionType === 'g') {
      return 'ImageGridView';
    }
    if (transcriptionType === 'f') {
      return 'ImageView';
    }
    if (transcriptionType === 'glossary') {
      return 'GlossaryView';
    }
    return xmlMode ? 'XMLView' : 'TranscriptionView';
  }

  viewportState(side) {
    const { document: doc, viewports } = this.props;
    const viewport = viewports[side];

    // blank folio ID
    if (viewport.folioID === '-1') {
      return {
        ...this.state[side],
        iiifShortID: viewport.folioID,
        transcriptionType: viewport.transcriptionType,
      };
    }

    const shortID = viewport.folioID;
    const folioCount = doc.folios.length;
    let nextID = '';
    let prevID = '';
    let current_hasPrev = false;
    let current_hasNext = false;

    if (this.state.bookMode) {
      const [versoID] = this.findBookFolios(shortID);
      const current_idx = doc.folioIndex[versoID].pageNumber;
      if (current_idx > -1) {
        current_hasNext = (current_idx < (folioCount - 2));
        nextID = current_hasNext ? doc.folios[current_idx + 2].id : '';
        current_hasPrev = (current_idx > 1 && folioCount > 1);
        prevID = current_hasPrev ? doc.folios[current_idx - 2].id : '';
      }
    } else {
      const current_idx = doc.folioIndex[shortID].pageNumber;
      if (current_idx > -1) {
        current_hasNext = (current_idx < (folioCount - 1));
        nextID = current_hasNext ? doc.folios[current_idx + 1].id : '';

        current_hasPrev = (current_idx > 0 && folioCount > 1);
        prevID = current_hasPrev ? doc.folios[current_idx - 1].id : '';
      }
    }

    return {
      ...this.state[side],
      iiifShortID: shortID,
      transcriptionType: viewport.transcriptionType,
      hasPrevious: current_hasPrev,
      hasNext: current_hasNext,
      previousFolioShortID: prevID,
      nextFolioShortID: nextID,
    };
  }

  renderPane(side, docView) {
    const viewType = this.determineViewType(side);
    const key = this.viewPaneKey(side);

    if (viewType === 'ImageView') {
      return (
        <ImageView
          key={key}
          documentView={docView}
          documentViewActions={this.documentViewActions}
          side={side}
        />
      );
    } if (viewType === 'TranscriptionView') {
      const folioID = docView[side].iiifShortID;
      let transcriptionType = docView[side].transcriptionType;
      return (
        <TranscriptionView
          key={key}
          documentView={docView}
          documentViewActions={this.documentViewActions}
          side={side}
          folioID={folioID}
          transcriptionType={transcriptionType}
        />
      );
    } if (viewType === 'XMLView') {
      return (
        <XMLView
          key={key}
          documentView={docView}
          documentViewActions={this.documentViewActions}
          side={side}
        />
      );
    } if (viewType === 'ImageGridView') {
      return (
        <ImageGridView
          key={key}
          documentView={docView}
          documentViewActions={this.documentViewActions}
          side={side}
        />
      );
    } if (viewType === 'GlossaryView') {
      return (
        <GlossaryView
          key={key}
          documentView={docView}
          documentViewActions={this.documentViewActions}
          side={side}
        />
      );
    }
    return (
      <div>ERROR: Unrecognized viewType.</div>
    );
  }

  viewPaneKey(side) {
    const pane = this.state[side];

    if (pane.viewType === 'ImageGridView') {
      return `${side}-${pane.viewType}`;
    }
    if (typeof pane.folio !== 'undefined') {
      return `${side}-${pane.viewType}-${pane.folio.id}`;
    }
    return `${side}-${pane.viewType}`;
  }

  render() {
    if (!this.props.document.loaded) { return null; }

    // combine component state with state from props
    const docView = {
      ...this.state,
      left: this.viewportState('left'),
      right: this.viewportState('right'),
    };
    const mobileDocView = {
      ...this.state,
      right: { ...this.viewportState('right'), isGridMode: false },
    };

    if (isWidthUp('md', this.props.width)) {
      return (
        <div>
          <SplitPaneView
            leftPane={this.renderPane('left', docView)}
            rightPane={this.renderPane('right', docView)}
            onWidth={this.onWidth}
          />
        </div>
      );
    }
    return (
      <div>
        <SinglePaneView
          singlePane={this.renderPane('right', mobileDocView)}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    document: state.document,
  };
}

export default withWidth()(connect(mapStateToProps)(DocumentView));
