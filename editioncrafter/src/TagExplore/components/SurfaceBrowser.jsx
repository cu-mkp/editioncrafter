import { Box, Button, ButtonGroup, Collapse, Divider, IconButton, Typography } from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import GridOnIcon from '@material-ui/icons/GridOn'
import ListIcon from '@material-ui/icons/List'
import TuneIcon from '@material-ui/icons/Tune'
import { useEffect, useMemo, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'
import { getObjs } from '../../common/lib/sql'
import DocumentDetail from './DocumentDetail'
import TagFilters from './TagFilters'

function getData(db) {
  const docStmt = db.prepare(`
      SELECT
        documents.id AS id,
        documents.name AS name,
        documents.local_id AS local_id
      FROM
        documents
    `)

  return getObjs(docStmt)
}

function parseFolioID(folioID) {
  if (!folioID) {
    return null
  }
  const parts = folioID.split('_')
  const localID = parts.slice(0, parts.length - 1).join('_')
  const surfaceID = parts[parts.length - 1]

  return {
    localID,
    surfaceID,
  }
}

function getSelection(path) {
  const parts = path.split('/')
  const folioID = parts[2]
  const folioID2 = parts[4]
  const left = parseFolioID(folioID)
  const right = parseFolioID(folioID2)
  return { left, right }
}

function SurfaceBrowser(props) {
  const { db, open, toggleOpen } = props
  const documents = useMemo(() => getData(db), [db])
  const [pageCount, setPageCount] = useState({})
  const [totalPages, setTotalPages] = useState(0)
  const [tags, setTags] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const selection = useMemo(() => getSelection(location.pathname), [location])

  const navigateToSelection = (nextSelection) => {
    const folioID = nextSelection?.left ? `${nextSelection.left.localID}_${nextSelection.left.surfaceID}` : null
    const folioID2 = nextSelection?.right ? `${nextSelection.right.localID}_${nextSelection.right.surfaceID}` : null
    const navParams = `/ec/${folioID || '-1'}/${folioID ? 'f' : 'g'}/${folioID2 || '-1'}/${folioID2 ? 'f' : 'g'}`
    navigate(navParams + location.search)
  }

  const updatePageCount = (documentID, numPages) => {
    const newCount = pageCount
    newCount[documentID] = numPages
    setPageCount(newCount)
  }

  useEffect(() => {
    let p = 0
    for (const key of Object.keys(pageCount)) {
      p += pageCount[key]
    }
    setTotalPages(p)
  }, [pageCount, tags])

  const documentDetails = documents.map((doc) => {
    return (
      <DocumentDetail
        key={`document-detail-${doc.id}`}
        db={db}
        documentName={doc.name}
        documentLocalID={doc.local_id}
        documentID={doc.id}
        selection={selection}
        navigateToSelection={navigateToSelection}
        updatePageCount={count => updatePageCount(doc.id, count)}
        tags={tags}
      >
      </DocumentDetail>
    )
  })

  return (
    <Collapse in={open} horizontal>
      <Box
        className="surface-browser"
      >
        <IconButton onClick={toggleOpen} className="surface-browser-close">
          <ChevronLeftIcon />
        </IconButton>
        <Divider></Divider>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Contents</Typography>
          <Button
            startIcon={<TuneIcon />}
            onClick={() => setShowFilters(current => (!current))}
          >
            Filter
            { tags && tags.length
              ? (
                  <div style={{
                    fontSize: 'small',
                    backgroundColor: 'red',
                    borderRadius: '999px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '3px',
                    color: 'white',
                    height: '16px',
                    width: '16px',
                    position: 'absolute',
                    top: '0',
                    left: '-12px',
                  }}
                  >
                    {tags.length}
                  </div>
                )
              : null}
          </Button>
        </div>
        <Typography>
          {totalPages}
          {' '}
          Page
          { totalPages !== 1 ? 's' : ''}
        </Typography>
        {/* <ButtonGroup color="primary" aria-label="outlined primary button group">
          <IconButton aria-label="grid">
            <GridOnIcon></GridOnIcon>
          </IconButton>
          <IconButton aria-label="list">
            <ListIcon></ListIcon>
          </IconButton>
        </ButtonGroup> */}
        { showFilters && (
          <TagFilters
            db={db}
            filters={tags}
            onToggleSelected={(tagId) => {
              if (tags.includes(tagId)) {
                setTags(current => (current.filter(t => (t !== tagId))))
              }
              else {
                setTags(current => ([...current, tagId]))
              }
            }}
          />
        ) }
        <Box className="surface-browser-document-details">
          { documentDetails }
        </Box>
      </Box>
    </Collapse>
  )
}

export default SurfaceBrowser
