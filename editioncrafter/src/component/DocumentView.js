import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import {
  useLocation, useNavigate, useParams,
} from 'react-router-dom';
import SplitPaneView from './SplitPaneView';
import { dispatchAction } from '../model/ReduxStore';
import ImageView from './ImageView';
import ImageGridView from './ImageGridView';
import TranscriptionView from './TranscriptionView';
import XMLView from './XMLView';
import GlossaryView from './GlossaryView';
import SinglePaneView from './SinglePaneView';

const paneDefaults = {
  isXMLMode: false,
  width: 0,
};

const DocumentView = (props) => {
  const [linkedMode, setLinkedMode] = useState(!props.document.variorum);
  const [bookMode, setBookMode] = useState(false);
  const [left, setLeft] = useState(paneDefaults);
  const [right, setRight] = useState(paneDefaults);
  const [third, setThird] = useState(paneDefaults);

  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate while keeping existing search params
  const navigateWithParams = (pathname) => {
    navigate(pathname + location.search);
  };

  const getViewports = () => {
    const {
      folioID, transcriptionType, folioID2, transcriptionType2, folioID3, transcriptionType3
    } = params;
    const { document } = props;
    const firstTranscriptionType = document.variorum ? Object.keys(document.transcriptionTypes[Object.keys(document.transcriptionTypes)[0]])[0] : Object.keys(document.transcriptionTypes)[0]; //need to change this in the variorum case when there's more than one set of types
    if (!folioID) {
      // route /folios
      return {
        left: {
          folioID: '-1',
          transcriptionType: 'g',
        },
        right: {
          folioID: '-1',
          transcriptionType: document.variorum ? 'g' : firstTranscriptionType,
        },
        third: {
          folioID: '-1',
          transcriptionType: 'g',
        }
      };
    }

    const leftFolioID = folioID;
    let leftTranscriptionType; let rightFolioID; let
      rightTranscriptionType; let thirdFolioID; let thirdTranscriptionType;
    if (folioID2) {
      // route /ec/:folioID/:transcriptionType/:folioID2/:transcriptionType2
      leftTranscriptionType = transcriptionType;
      rightFolioID = folioID2;
      rightTranscriptionType = transcriptionType2 || firstTranscriptionType;
      if (folioID3) {
        // route /ec/:folioID/:transcriptionType/:folioID2/:transcriptionType2/:folioID3/:transcriptionType3
        thirdFolioID = folioID3;
        thirdTranscriptionType = transcriptionType3 || firstTranscriptionType;
      } else {
        thirdFolioID = '-1';
        thirdTranscriptionType = 'g';
      }
    } else {
      // route /ec/:folioID
      // route /ec/:folioID/:transcriptionType
      leftTranscriptionType = 'f';
      rightFolioID = folioID;
      rightTranscriptionType = transcriptionType || firstTranscriptionType;
      thirdFolioID = '-1';
      thirdTranscriptionType = 'g';
    }

    return {
      left: {
        folioID: leftFolioID,
        transcriptionType: leftTranscriptionType,
      },
      right: {
        folioID: rightFolioID,
        transcriptionType: rightTranscriptionType,
      },
      third: {
        folioID: thirdFolioID,
        transcriptionType: thirdTranscriptionType,
      }
    };
  };

  useEffect(() => {
    dispatchAction(props, 'DiplomaticActions.setFixedFrameMode', true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setXMLMode = (side, xmlMode) => {
    if (side === 'left') {
      setLeft({ ...left, isXMLMode: xmlMode });
    } else if (side === 'right') {
      setRight({ ...right, isXMLMode: xmlMode });
    } else {
      setThird({ ...third, isXMLMode: xmlMode });
    }
  };

  const handleSetBookMode = (shortid, bool) => {
    setBookMode(bool);

    if (bool) {
      const [versoID, rectoID] = findBookFolios(shortid);
      navigateFolios(versoID, 'f', rectoID, 'f');
    }
  };

  const jumpToFolio = (folioName, side) => {
    const { document } = props;
    // Convert folioName to ID (and confirm it exists)
    if (document.folioByName[folioName]) {
      const folioID = document.folioByName[folioName]?.id;
      changeCurrentFolio(folioID, side, getViewports()[side].transcriptionType);
    }
  };

  const findBookFolios = (folioID) => {
    const { document } = props;
    const versoFolio = document.folioIndex[folioID];
    const { name, pageNumber } = versoFolio;

    if (!name.endsWith('v') && name.endsWith('r')) {
      return [document.folios[pageNumber - 1].id, document.folios[pageNumber].id];
    }

    return [document.folios[pageNumber].id, document.folios[pageNumber + 1].id];
  };

  const onWidth = (leftWidth, rightWidth, thirdWidth) => {
    setLeft({ ...left, width: leftWidth });
    setRight({ ...right, width: rightWidth });
    setThird({ ...third, width: thirdWidth });
  };

  const changeTranscriptionType = (side, transcriptionType) => {
    const currentViewports = getViewports();
    if (side === 'left') {
      const { folioID } = currentViewports.left;
      const otherSide = currentViewports.right;
      navigateFolios(
        folioID,
        transcriptionType,
        otherSide.folioID,
        otherSide.transcriptionType,
        currentViewports.third.folioID,
        currentViewports.third.transcriptionType,
      );
    } else if (side === 'right') {
      const { folioID } = currentViewports.right;
      const otherSide = currentViewports.left;
      navigateFolios(
        otherSide.folioID,
        otherSide.transcriptionType,
        folioID,
        transcriptionType,
      );
    } else {
      const { folioID } = currentViewports.third;
      navigateFolios(
        currentViewports.left.folioID,
        currentViewports.left.transcriptionType,
        currentViewports.right.folioID,
        currentViewports.right.transcriptionType,
        folioID,
        transcriptionType,
      )
    }
  };

  const navigateFolios = (folioID, transcriptionType, folioID2, transcriptionType2, folioID3, transcriptionType3) => {
    if (!folioID) {
      // goto grid view
      navigateWithParams('/ec');
      return;
    }
    if (!transcriptionType) {
      // goto folioID, tc
      navigateWithParams(`/ec/${folioID}`);
      return;
    }
    if (!folioID2) {
      // goto folioID, transcriptionType
      navigateWithParams(`/ec/${folioID}/${transcriptionType}`);
      return;
    }
    if (!transcriptionType2) {
      // goto folioID, transcriptionType, folioID2, tc
      navigateWithParams(`/ec/${folioID}/${transcriptionType}/${folioID2}/tc`);
      return;
    }
    if (!folioID3) {
      // goto folioID, transcriptionType, folioID2, transcriptionType2
      navigateWithParams(`/ec/${folioID}/${transcriptionType}/${folioID2}/${transcriptionType2}`);
      return;
    }
    if (!transcriptionType3) {
      // goto folioID, transcriptionType, folioID2, transcriptionType2, folioID3, tc
      navigateWithParams(`/ec/${folioID}/${transcriptionType}/${folioID2}/${transcriptionType2}/${folioID3}/f`);
      return;
    }
    // goto folioID, transcrptionType, folioID2, transcriptionType2, folioID3, transcriptionType3
    navigateWithParams(`/ec/${folioID}/${transcriptionType}/${folioID2}/${transcriptionType2}/${folioID3}/${transcriptionType3}`);
  };

  const changeCurrentFolio = (folioID, side, transcriptionType) => {
    // Lookup prev/next
    const currentViewports = getViewports();
    console.log(currentViewports);

    if (bookMode) {
      const [versoID, rectoID] = findBookFolios(folioID);
      if (versoID) {
        navigateFolios(versoID, 'f', rectoID, 'f');
      }
    } else if (linkedMode) {
      if (side === 'left') {
        const otherSide = currentViewports.right;
        navigateFolios(
          folioID,
          transcriptionType,
          folioID,
          otherSide.transcriptionType,
        );
      } else if (side === 'right') {
        const otherSide = currentViewports.left;
        navigateFolios(
          folioID,
          otherSide.transcriptionType,
          folioID,
          transcriptionType,
        );
      } else {
        navigateFolios(
          currentViewports.left.folioID,
          currentViewports.left.transcriptionType,
          currentViewports.right.folioID,
          currentViewports.right.transcriptionType,
          folioID,
          transcriptionType
        )
      }
    } else if (side === 'left') {
      const otherSide = currentViewports.right;
      const thirdPane = currentViewports.third;
      navigateFolios(
        folioID,
        transcriptionType,
        otherSide.folioID,
        otherSide.transcriptionType,
        thirdPane.folioID,
        thirdPane.transcriptionType,
      );
    } else if (side === 'right') {
      const otherSide = currentViewports.left;
      const thirdPane = currentViewports.third;
      navigateFolios(
        otherSide.folioID,
        otherSide.transcriptionType,
        folioID,
        transcriptionType,
        thirdPane.folioID,
        thirdPane.transcriptionType,
      );
    } else {
      navigateFolios(
        currentViewports.left.folioID,
        currentViewports.left.transcriptionType,
        currentViewports.right.folioID,
        currentViewports.right.transcriptionType,
        folioID,
        transcriptionType
      )
    }
  };

  const determineViewType = (side) => {
    const { transcriptionType } = getViewports()[side];
    const xmlMode = side === 'left'
      ? left.isXMLMode
      : side === 'right' ? right.isXMLMode : third.isXMLMode;

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
  };

  const viewportState = (side) => {
    const { document: doc } = props;
    const viewport = getViewports()[side];

    // blank folio ID
    if (viewport.folioID === '-1') {
      return {
        ...side === 'left' ? left : side === 'right' ? right : third,
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

    if (bookMode) {
      const [versoID] = findBookFolios(shortID);
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
      ...side === 'left' ? left : side === 'right' ? right : third,
      iiifShortID: shortID,
      transcriptionType: viewport.transcriptionType,
      hasPrevious: current_hasPrev,
      hasNext: current_hasNext,
      previousFolioShortID: prevID,
      nextFolioShortID: nextID,
    };
  };

  const documentViewActions = {
    setXMLMode,
    setLinkedMode,
    setBookMode: handleSetBookMode,
    changeTranscriptionType,
    changeCurrentFolio,
    jumpToFolio,
  };

  const renderPane = (side, docView) => {
    const viewType = determineViewType(side);
    const key = viewPaneKey(side);
    const folioID = docView[side].iiifShortID;
    const { transcriptionType } = docView[side];

    if (viewType === 'ImageView') {
      return (
        <ImageView
          key={key}
          folioID={folioID}
          documentView={docView}
          documentViewActions={documentViewActions}
          side={side}
        />
      );
    } if (viewType === 'TranscriptionView') {
      return (
        <TranscriptionView
          key={key}
          documentView={docView}
          documentViewActions={documentViewActions}
          side={side}
          folioID={folioID}
          transcriptionType={transcriptionType}
        />
      );
    } if (viewType === 'XMLView') {
      return (
        <XMLView
          key={key}
          folioID={folioID}
          transcriptionType={transcriptionType}
          documentView={docView}
          documentViewActions={documentViewActions}
          side={side}
        />
      );
    } if (viewType === 'ImageGridView') {
      return (
        <ImageGridView
          key={key}
          documentView={docView}
          documentViewActions={documentViewActions}
          side={side}
          selectedDoc={props.document.variorum && Object.keys(props.document.derivativeNames)[side === 'left' ? 0 : 1]}
        />
      );
    } if (viewType === 'GlossaryView') {
      return (
        <GlossaryView
          key={key}
          documentView={docView}
          documentViewActions={documentViewActions}
          side={side}
        />
      );
    }
    return (
      <div>ERROR: Unrecognized viewType.</div>
    );
  };

  const viewPaneKey = (side) => {
    const pane = side === 'left'
      ? left
      : side === 'right'
      ? right
      : third;

    if (pane.viewType === 'ImageGridView') {
      return `${side}-${pane.viewType}`;
    }
    if (typeof pane.folio !== 'undefined') {
      return `${side}-${pane.viewType}-${pane.folio.id}`;
    }
    return `${side}-${pane.viewType}`;
  };

  if (!props.document.loaded) { return null; }

  // combine component state with state from props
  const docView = {
    linkedMode,
    bookMode,
    left: viewportState('left'),
    right: viewportState('right'),
    third: viewportState('third'),
  };

  const mobileDocView = {
    linkedMode,
    bookMode,
    left,
    right: { ...viewportState('right') },
  };

  if (isWidthUp('md', props.width)) {
    return (
      <div>
        <SplitPaneView
          leftPane={renderPane('left', docView)}
          rightPane={renderPane('right', docView)}
          thirdPane={renderPane('third', docView)}
          onWidth={onWidth}
        />
      </div>
    );
  }
  return (
    <div>
      <SinglePaneView
        singlePane={renderPane('right', mobileDocView)}
      />
    </div>
  );
};

function mapStateToProps(state) {
  return {
    document: state.document,
  };
}

export default withWidth()(connect(mapStateToProps)(DocumentView));
