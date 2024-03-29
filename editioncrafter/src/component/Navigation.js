import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  FaArrowCircleLeft,
  FaArrowCircleRight,
} from 'react-icons/fa';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import JumpToFolio from './JumpToFolio';
import DocumentHelper from '../model/DocumentHelper';
import HelpPopper from './HelpPopper';
import AlphabetLinks from './AlphabetLinks';
import useIsWidthUp from '../hooks/useIsWidthUp';

const initialPopoverObj = {
  anchorEl: null
};

const Navigation = (props) => {
  const [popover, setPopover] = useState({ ...initialPopoverObj });
  const [openHelp, setOpenHelp] = useState(false);
  const [openHelpNarrow, setOpenHelpNarrow] = useState(false);

  const helpRef = useRef(null);
  const helpRefNarrow = useRef(null);

  useEffect(() => {
    console.log(helpRef.current);
  }, []);

  const onJumpBoxBlur = (event) => {
    setPopover({ anchorEl: null });
  };

  const changeType = (event) => {
    if (event.target.value === undefined) return;
    props.documentViewActions.changeTranscriptionType(
      props.side,
      event.target.value,
    );
  };

  const onGoToGrid = (event) => {
    props.documentViewActions.changeTranscriptionType(props.side, 'g');
  }

  const toggleHelp = (event) => {
    setOpenHelp(!openHelp);
  };

  const toggleHelpNarrow = (event) => {
    setOpenHelpNarrow(!openHelpNarrow);
  };

  const toggleBookmode = (event) => {
    if (!props.documentView.bookMode) {
      props.documentViewActions.changeCurrentFolio(
        props.documentView.left.iiifShortID,
        'left',
        props.documentView.left.transcriptionType,
      );

      props.documentViewActions.changeCurrentFolio(
        props.documentView.left.nextFolioShortID,
        'right',
        props.documentView.left.transcriptionType,
      );
    }

    props.documentViewActions.setBookMode(
      props.documentView.left.iiifShortID,
      !props.documentView.bookMode,
    );
  };

  const toggleXMLMode = (event) => {
    props.documentViewActions.setXMLMode(
      props.side,
      !props.documentView[props.side].isXMLMode,
    );
  };

  const toggleLockmode = (event) => {
    if (props.documentView.bookMode) {
      toggleBookmode();
      return;
    }

    // If we are transitioning from unlocked to locked, sync up the panes
    if (props.documentView.linkedMode === false) {
      if (props.side === 'left') {
        props.documentViewActions.changeCurrentFolio(
          props.documentView.left.iiifShortID,
          'right',
          props.documentView.right.transcriptionType,
        );
      } else {
        props.documentViewActions.changeCurrentFolio(
          props.documentView.right.iiifShortID,
          'left',
          props.documentView.left.transcriptionType,
        );
      }
    }

    // Set lock
    props.documentViewActions.setLinkedMode(
      !props.documentView.linkedMode,
    );
  };

  const changeCurrentFolio = (event) => {
    const {
      documentViewActions, documentView, side,
    } = props;

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

  const revealJumpBox = (event) => {
    setPopover({
      anchorEl: event.currentTarget
    });
  };

  const {
    side, document, documentView, documentViewActions, onFilterChange,
  } = props;

  const isWidthUp = useIsWidthUp('md');

  if (!documentView) {
    return (
      <div>
        Unknown Transcription Type
      </div>
    );
  }

  const getSelectContainerStyle = () => {
    if (isWidthUp) {
      if (documentView[side].width < 500 && !document.variorum) {
        return { display: 'none' };
      }

      return { display: 'flex' };
    }

    return null;
  };

  console.log(side, documentView[side]);

  const recommendedWidth = (documentView[side].width - 8);// the divder is 16 px wide so each side is minus 8
  const widthStyle = { width: recommendedWidth, maxWidth: recommendedWidth };
  const selectColorStyle = documentView[side].transcriptionType === 'f' ? { color: 'white' } : { color: 'black' };
  const selectClass = documentView[side].transcriptionType === 'f' ? 'dark' : 'light';
  const showButtonsStyle = documentView[side].transcriptionType === 'glossary' ? { visibility: 'hidden' } : { visibility: 'visible' };
  const selectContainerStyle = { display: 'flex' }; //what's the reason we want this to be hidden sometimes?
  let lockIconClass = (documentView.linkedMode) ? 'fa fa-lock' : 'fa fa-lock-open';
  if (!documentView.bookMode) {
    lockIconClass += ' active';
  }
  const imageViewActive = documentView[side].transcriptionType === 'f';
  const bookIconClass = (documentView.bookMode) ? 'fa fa-book active' : 'fa fa-book';
  const xmlIconClass = (documentView[side].isXMLMode) ? 'fa fa-code active' : 'fa fa-code';
  const folioName = document.folioIndex[documentView[side].iiifShortID]?.name;
  const jumpToIconStyle = (imageViewActive) ? { color: 'white' } : { color: 'black' };
  // this is messy but faster for the moment then figuring out why the sides dont behave the same
  const helpMarginStyle = side === 'left' ? { marginRight: '55px' } : { marginRight: '15px' };

  return (
    <>
      <div className="navigationComponent">
        <div id="navigation-row" className="navigationRow">

          { documentView[side].transcriptionType !== 'glossary' ? (

            <div id="tool-bar-buttons" className="breadcrumbs" style={showButtonsStyle}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}> 
                <span 
                  className="fas fa-th" 
                  style={{ cursor: documentView[side].transcriptionType !== 'g' ? 'pointer' : 'default', padding: '0 15px' }} 
                  title={documentView[side].transcriptionType !== 'g' && "Return to Grid View"} 
                  onClick={documentView[side].transcriptionType !== 'g' && onGoToGrid} 
                />

                <span
                  title="Toggle coordination of views"
                  onClick={toggleLockmode}
                  className={lockIconClass}
                />
                                          
                <span
                  title="Toggle book mode"
                  onClick={toggleBookmode}
                  className={bookIconClass}
                />
                                      
                <span
                  title="Toggle XML mode"
                  onClick={toggleXMLMode}
                  className={imageViewActive ? 'invisible' : xmlIconClass}
                />
                                              
                {/* <span title="Toggle single column mode"  onClick={this.toggleColumns}
                                                        className={columnIconClass}></span> */}
                                              
                
                <span
                  title="Go back"
                  onClick={changeCurrentFolio}
                  data-id={documentView[side].previousFolioShortID}
                  className={(documentView[side].hasPrevious) ? 'arrow' : 'arrow disabled'}
                >

                  <FaArrowCircleLeft />

                
                </span>

                <span
                  title="Go forward"
                  onClick={changeCurrentFolio}
                  data-id={documentView[side].nextFolioShortID}
                  className={(documentView[side].hasNext) ? 'arrow' : 'arrow disabled'}
                >

                  <FaArrowCircleRight />
                </span>
              </div>
                                                &nbsp;&nbsp;
              <div title={`${props.documentName || document.documentName}/${folioName}`} style={{ display: 'flex', overflowX: 'hidden', justifyContent: 'flex-end' }}>
                <span>{props.documentName || document.documentName}</span>
                <span>{' / '}</span>
                <div
                  onClick={revealJumpBox}
                  className="folioName"
                  style={{ flexShrink: '0' }}
                >

                  {folioName}

                  <span style={jumpToIconStyle} className="fa fa-hand-point-right" />
                </div>
              </div>

              <JumpToFolio
                side={side}
                anchorEl={popover.anchorEl}                                        
                submitHandler={documentViewActions.jumpToFolio}
                blurHandler={onJumpBoxBlur}
              />

            </div>
          )
            : (<AlphabetLinks onFilterChange={onFilterChange} value={props.value} />)}

          <div id="doc-type-help" style={selectContainerStyle} ref={helpRef}>
            <Select
              className={selectClass}
              style={{ ...selectColorStyle, marginRight: 15 }}
              value={documentView[side].transcriptionType}
              id="doc-type"
              onClick={changeType}
            >
              {Object.keys(props.document.folios.find((fol) => (fol.id == props.documentView[props.side].iiifShortID)).annotationURLs).map(ttKey => (
                <MenuItem value={ttKey} key={ttKey}>{props.document.variorum ? props.document.transcriptionTypes[props.document.folios.find((fol) => (fol.id == props.documentView[props.side].iiifShortID)).doc_id][ttKey] : props.document.transcriptionTypes[ttKey]}</MenuItem>
              ))}
              <MenuItem value="f" key="f">
                {DocumentHelper.transcriptionTypeLabels.f}
              </MenuItem>
              <MenuItem value="glossary" key="glossary">
                {DocumentHelper.transcriptionTypeLabels.glossary}
              </MenuItem>
            </Select>
            <span
              title="Toggle folio help"
              onClick={toggleHelp}
              className="helpIcon"
            >
              <i className="fas fa-question-circle" />
            </span>
            <HelpPopper
              marginStyle={helpMarginStyle}
              anchorEl={helpRef.current}
              open={openHelp}
              onClose={toggleHelp}
            />
          </div>

        </div>
      </div>
      <div className="navigationComponentNarrow">
        <div id="navigation-row" className="navigationRowNarrow">

          { documentView[side].transcriptionType !== 'glossary' ? (

            <div id="tool-bar-buttons" className="breadcrumbsNarrow" style={showButtonsStyle}>
                
              <span 
                className="fas fa-th" 
                style={{ cursor: documentView[side].transcriptionType !== 'g' ? 'pointer' : 'default', padding: '0 15px' }} 
                title={documentView[side].transcriptionType !== 'g' && "Return to Grid View"} 
                onClick={documentView[side].transcriptionType !== 'g' && onGoToGrid} 
              />
                                                &nbsp;
              <span
                title="Toggle XML mode"
                onClick={toggleXMLMode}
                className={imageViewActive ? 'invisible' : xmlIconClass}
              />

              { imageViewActive && (
                <>
                  <span
                  title="Go back"
                  onClick={changeCurrentFolio}
                  data-id={documentView[side].previousFolioShortID}
                  className={(documentView[side].hasPrevious) ? 'arrow' : 'arrow disabled'}
                >
                  {' '}
                  <FaArrowCircleLeft />
                  {' '}
  
                </span>
  
                <span
                  title="Go forward"
                  onClick={changeCurrentFolio}
                  data-id={documentView[side].nextFolioShortID}
                  className={(documentView[side].hasNext) ? 'arrow' : 'arrow disabled'}
                >
                  {' '}
                  <FaArrowCircleRight />
                </span>
                </>
              )}

            </div>
          )
            : (<AlphabetLinks onFilterChange={onFilterChange} value={props.value} />)}

          <div id="doc-type-help" style={selectContainerStyle} ref={helpRefNarrow}>
            <Select
              className={selectClass}
              style={{ ...selectColorStyle, marginRight: 15 }}
              value={documentView[side].transcriptionType}
              id="doc-type"
              onClick={changeType}
            >
              {Object.keys(props.document.folios.find((fol) => (fol.id == props.documentView[props.side].iiifShortID)).annotationURLs).map(ttKey => (
                <MenuItem value={ttKey} key={ttKey}>{props.document.variorum ? props.document.transcriptionTypes[props.document.folios.find((fol) => (fol.id == props.documentView[props.side].iiifShortID)).doc_id][ttKey] : props.document.transcriptionTypes[ttKey]}</MenuItem>
              ))}
              <MenuItem value="f" key="f">
                {DocumentHelper.transcriptionTypeLabels.f}
              </MenuItem>
              <MenuItem value="glossary" key="glossary">
                {DocumentHelper.transcriptionTypeLabels.glossary}
              </MenuItem>
            </Select>
            <span
              title="Toggle folio help"
              onClick={toggleHelpNarrow}
              className="helpIcon"
            >
              <i className="fas fa-question-circle" />
            </span>
            <HelpPopper
              marginStyle={helpMarginStyle}
              anchorEl={helpRefNarrow.current}
              open={openHelpNarrow}
              onClose={toggleHelpNarrow}
            />
          </div>

        </div>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    document: state.document,
  };
}

export default (connect(mapStateToProps)(Navigation));
