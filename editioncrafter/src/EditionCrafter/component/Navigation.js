import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import React, { useMemo, useRef, useState } from 'react'
import { BsFillGrid3X3GapFill } from 'react-icons/bs'
import {
  FaCode,
  FaQuestionCircle,
} from 'react-icons/fa'
import { GoTag } from 'react-icons/go'
import { HiOutlineBookOpen } from 'react-icons/hi'
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline, IoLockOpenOutline } from 'react-icons/io5'
import { connect } from 'react-redux'
import DocumentPagesIcon from '../icons/DocumentPagesIcon'
import DocumentHelper from '../model/DocumentHelper'
import AlphabetLinks from './AlphabetLinks'
import HelpPopper from './HelpPopper'
import JumpToFolio from './JumpToFolio'
import TagToolbar from './TagToolbar'

const initialPopoverObj = {
  anchorEl: null,
}

function NavArrows(props) {
  return (
    <>
      <span
        title="Go back"
        onClick={props.changeCurrentFolio}
        data-id={props.documentView[props.side].previousFolioShortID}
        className={(!props.documentView[props.side].hasPrevious) ? 'disabled nav-arrow' : 'nav-arrow'}
      >
        <IoArrowBackCircleOutline />
      </span>

      <span
        title="Go forward"
        onClick={props.changeCurrentFolio}
        data-id={props.documentView[props.side].nextFolioShortID}
        className={(!props.documentView[props.side].hasNext) ? 'disabled nav-arrow' : 'nav-arrow'}
      >
        <IoArrowForwardCircleOutline />
      </span>
    </>
  )
}

function GridViewButton(props) {
  return (
    <button
      className="grid-view-button"
      style={{ cursor: props.documentView[props.side].transcriptionType !== 'g' ? 'pointer' : 'default', padding: '0 15px' }}
      title={props.documentView[props.side].transcriptionType !== 'g' && 'Return to Grid View'}
      onClick={props.documentView[props.side].transcriptionType !== 'g' && props.onGoToGrid}
      type="button"
    >
      <BsFillGrid3X3GapFill />
    </button>
  )
}

function ToggleButton(props) {
  return (
    <button
      className={`toggle-button ${props.active ? 'active' : ''}`}
      onClick={props.onClick}
      title="Toggle XML Mode"
      type="button"
    >
      <props.icon />
    </button>
  )
}

function Navigation(props) {
  const [popover, setPopover] = useState({ ...initialPopoverObj })
  const [openHelp, setOpenHelp] = useState(false)
  const [openHelpNarrow, setOpenHelpNarrow] = useState(false)
  const [openTags, setOpenTags] = useState(false)

  const helpRef = useRef(null)
  const helpRefNarrow = useRef(null)

  const onJumpBoxBlur = () => {
    setPopover({ anchorEl: null })
  }

  const changeType = (event) => {
    if (event.target.value === undefined || event.target.value === 0)
      return
    props.documentViewActions.changeTranscriptionType(
      props.side,
      event.target.value,
    )
  }

  const onGoToGrid = () => {
    props.documentViewActions.changeTranscriptionType(props.side, 'g')
  }

  const toggleHelp = () => {
    setOpenHelp(!openHelp)
  }

  const toggleHelpNarrow = () => {
    setOpenHelpNarrow(!openHelpNarrow)
  }

  const toggleTags = () => setOpenTags(!openTags)

  const toggleBookmode = () => {
    if (!props.documentView.bookMode) {
      props.documentViewActions.changeCurrentFolio(
        props.documentView.left.iiifShortID,
        'left',
        props.documentView.left.transcriptionType,
      )

      props.documentViewActions.changeCurrentFolio(
        props.documentView.left.nextFolioShortID,
        'right',
        props.documentView.left.transcriptionType,
      )
    }

    props.documentViewActions.setBookMode(
      props.documentView.left.iiifShortID,
      !props.documentView.bookMode,
    )
  }

  const toggleXMLMode = () => {
    props.documentViewActions.setXMLMode(
      props.side,
      !props.documentView[props.side].isXMLMode,
    )
  }

  const toggleLockmode = () => {
    if (props.documentView.bookMode) {
      toggleBookmode()
      return
    }

    // If we are transitioning from unlocked to locked, sync up the panes
    if (props.documentView.linkedMode === false) {
      if (props.side === 'left') {
        props.documentViewActions.changeCurrentFolio(
          props.documentView.left.iiifShortID,
          'right',
          props.documentView.right.transcriptionType,
        )
      }
      else {
        props.documentViewActions.changeCurrentFolio(
          props.documentView.right.iiifShortID,
          'left',
          props.documentView.left.transcriptionType,
        )
      }
    }

    // Set lock
    props.documentViewActions.setLinkedMode(
      !props.documentView.linkedMode,
    )
  }

  const changeCurrentFolio = (event) => {
    const {
      documentViewActions,
      documentView,
      side,
    } = props

    if (typeof event.currentTarget.dataset.id === 'undefined' || event.currentTarget.dataset.id.length === 0) {
      return
    }
    const folioID = event.currentTarget.dataset.id
    documentViewActions.changeCurrentFolio(
      folioID,
      side,
      documentView[side].transcriptionType,
    )
  }

  const revealJumpBox = (event) => {
    setPopover({
      anchorEl: event.currentTarget,
    })
  }

  const {
    side,
    document,
    documentView,
    documentViewActions,
    onFilterChange,
  } = props

  const selectColorStyle = documentView[side].transcriptionType === 'f' ? { color: 'white' } : { color: 'black' }
  const selectClass = documentView[side].transcriptionType === 'f' ? 'dark' : 'light'
  const showButtonsStyle = documentView[side].transcriptionType === 'glossary' ? { visibility: 'hidden' } : { visibility: 'visible' }
  const selectContainerStyle = { display: 'flex' } // what's the reason we want this to be hidden sometimes?
  const imageViewActive = documentView[side].transcriptionType === 'f'
  const folioName = document.folioIndex[documentView[side].iiifShortID]?.name
  // this is messy but faster for the moment then figuring out why the sides dont behave the same
  const helpMarginStyle = side === 'left' ? { marginRight: '55px' } : { marginRight: '15px' }

  const folio = folioName
    ? document.folioByName[folioName]
    : null

  const docHasTags = useMemo(
    () => folio?.tagIds && folio.tagIds.length > 0 && document.tags && Object.keys(document.tags).length > 0,
    [folio, document],
  )

  if (!documentView) {
    return (
      <div>
        Unknown Transcription Type
      </div>
    )
  }

  return (
    <div>
      <div className="navigationComponent">

        { documentView[side].transcriptionType !== 'glossary'
          ? (

              <div id="tool-bar-buttons" className="breadcrumbs" style={showButtonsStyle}>

                <div className="toolbar-side toolbar-left">
                  <GridViewButton
                    documentView={documentView}
                    onGoToGrid={onGoToGrid}
                    side={side}
                  />
                  <div className="folio-path" style={{ display: 'flex', overflowX: 'hidden', justifyContent: 'flex-end' }}>
                    <span
                      className="document-title"
                      title={props.documentName || document.documentName}
                    >
                      {props.documentName || document.documentName}
                    </span>
                    <span>/</span>
                    <div
                      onClick={revealJumpBox}
                      className="folioName"
                      style={{ flexShrink: '0', minWidth: '40px' }}
                      title={folioName}
                    >
                      {folioName}
                    </div>
                  </div>

                  <NavArrows
                    changeCurrentFolio={changeCurrentFolio}
                    side={side}
                    documentView={documentView}
                  />
                </div>

                <div className="toolbar-side toolbar-right">
                  <div
                    className="book-mode-toggles"
                    title="Toggle book mode"
                    onClick={toggleBookmode}
                  >
                    <button className={props.documentView.bookMode ? 'selected' : ''} type="button">
                      <HiOutlineBookOpen />
                    </button>
                    <button className={props.documentView.bookMode ? '' : 'selected'} type="button">
                      <DocumentPagesIcon />
                    </button>
                  </div>

                  <label className="lockmode-container">
                    <input
                      onChange={toggleLockmode}
                      title="Toggle coordination of views"
                      type="checkbox"
                      value={props.documentView.linkedMode}
                    />
                    <span className="switch">
                      <span className="slider">
                        <IoLockOpenOutline />
                      </span>
                    </span>
                  </label>

                  <div className="vertical-separator" />

                  <Select
                    className={selectClass}
                    style={{ ...selectColorStyle, marginRight: 15, fontSize: 'max(16px, 1rem)' }}
                    value={documentView[side].transcriptionType}
                    id="doc-type"
                    onClick={changeType}
                  >
                    {Object.keys(props.document.folios.find(fol => (fol.id === props.documentView[props.side].iiifShortID)).annotationURLs).map(ttKey => (
                      <MenuItem value={ttKey} key={ttKey}>{props.document.variorum ? props.document.transcriptionTypes[props.document.folios.find(fol => (fol.id === props.documentView[props.side].iiifShortID)).doc_id][ttKey] : props.document.transcriptionTypes[ttKey]}</MenuItem>
                    ))}
                    <MenuItem value="f" key="f">
                      {DocumentHelper.transcriptionTypeLabels.f}
                    </MenuItem>
                    { props.glossary && (
                      <MenuItem value="glossary" key="glossary">
                        {DocumentHelper.transcriptionTypeLabels.glossary}
                      </MenuItem>
                    ) }
                  </Select>
                  {!imageViewActive && (
                    <ToggleButton
                      onClick={toggleXMLMode}
                      active={props.documentView[props.side].isXMLMode}
                      icon={FaCode}
                    />
                  )}
                  <div className="vertical-separator" />
                  {docHasTags && (
                    <ToggleButton
                      active={openTags}
                      onClick={toggleTags}
                      icon={GoTag}
                    />
                  )}
                  <button
                    title="Toggle folio help"
                    className={`toggle-button ${openHelp ? 'active' : ''}`}
                    onClick={toggleHelp}
                    ref={helpRef}
                    type="button"
                  >
                    <FaQuestionCircle />
                    <HelpPopper
                      marginStyle={helpMarginStyle}
                      anchorEl={helpRef.current}
                      open={openHelp}
                      onClose={toggleHelp}
                    />
                  </button>
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

      </div>
      {openTags && (
        <TagToolbar
          document={props.document}
          folio={folio}
          toggleTags={toggleTags}
        />
      )}
      <div className="navigationComponentNarrow">
        { documentView[side].transcriptionType !== 'glossary'
          ? (

              <div id="tool-bar-buttons" className="breadcrumbsNarrow" style={showButtonsStyle}>

                <GridViewButton
                  documentView={documentView}
                  onGoToGrid={onGoToGrid}
                  side={side}
                />
                                                &nbsp;

                {!imageViewActive && (
                  <ToggleButton
                    onClick={toggleXMLMode}
                    active={props.documentView[props.side].isXMLMode}
                    icon={FaCode}
                  />
                )}

                { imageViewActive && (
                  <NavArrows
                    changeCurrentFolio={changeCurrentFolio}
                    side={side}
                    documentView={documentView}
                  />
                )}

              </div>
            )
          : (<AlphabetLinks onFilterChange={onFilterChange} value={props.value} />)}

        <div id="doc-type-help" style={selectContainerStyle} ref={helpRefNarrow}>
          <Select
            className={selectClass}
            style={{ ...selectColorStyle, marginRight: 15, fontSize: 'max(16px, 1rem)' }}
            value={documentView[side].transcriptionType}
            id="doc-type"
            onClick={changeType}
          >
            {Object.keys(props.document.folios.find(fol => (fol.id === props.documentView[props.side].iiifShortID)).annotationURLs).map(ttKey => (
              <MenuItem value={ttKey} key={ttKey} title={ttKey}>{props.document.variorum ? props.document.transcriptionTypes[props.document.folios.find(fol => (fol.id === props.documentView[props.side].iiifShortID)).doc_id][ttKey] : props.document.transcriptionTypes[ttKey]}</MenuItem>
            ))}
            <MenuItem value="f" key="f">
              {DocumentHelper.transcriptionTypeLabels.f}
            </MenuItem>
            { props.glossary && (
              <MenuItem value="glossary" key="glossary">
                {DocumentHelper.transcriptionTypeLabels.glossary}
              </MenuItem>
            ) }
          </Select>
          <span
            title="Toggle folio help"
            onClick={toggleHelpNarrow}
            className="helpIcon"
          >
            <FaQuestionCircle />
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
  )
}

function mapStateToProps(state) {
  return {
    document: state.document,
    glossary: !!state.glossary.URL,
  }
}

export default (connect(mapStateToProps)(Navigation))
