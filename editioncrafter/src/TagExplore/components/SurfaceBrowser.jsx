import { Box, Button, Collapse, Divider, IconButton, Input, Typography } from '@material-ui/core'
// import { red } from '@material-ui/core/colors'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
// import GridOnIcon from '@material-ui/icons/GridOn'
// import ListIcon from '@material-ui/icons/List'
import TuneIcon from '@material-ui/icons/Tune'
import { useEffect, useMemo, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'
import { getObjs } from '../../common/lib/sql'
import DocumentDetail from './DocumentDetail'
import DocumentFilters from './DocumentFilters'
import TagFilters from './TagFilters'

function getData(db) {
  const docStmt = db.prepare(`
      WITH ags AS (SELECT document, json_array(role, person) as agent FROM agents)
      SELECT
        d.id AS id,
        d.name AS name,
        d.local_id AS local_id,
        json_group_array(document_languages.language) as languages,
        json_group_array(document_locations.location) as locations,
        json_group_array(classifications.keyword) as keywords,
        json_group_array(ags.agent) as agents
      FROM
        documents d
          LEFT JOIN document_languages ON d.id = document_languages.document
          LEFT JOIN document_locations ON d.id = document_locations.document
          LEFT JOIN classifications ON d.id = classifications.document
          LEFT JOIN ags ON d.id = ags.document
      GROUP BY d.id, d.name, d.local_id
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
  const [agents, setAgents] = useState([])
  const [keywords, setKeywords] = useState([])
  const [langs, setLangs] = useState([])
  const [locations, setLocations] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [query, setQuery] = useState(null)

  const filterDocs = (docs, filters) => {
    const { agents, keywords, langs, locations } = filters
    return docs.filter((doc) => {
      for (const ag of agents) {
        if (!JSON.parse(doc.agents)?.find(a => (a && ag.role === JSON.parse(a)[0] && ag.person === JSON.parse(a)[1]))) {
          return false
        }
      }
      for (const term of keywords) {
        if (!JSON.parse(doc.keywords)?.includes(term.term)) {
          return false
        }
      }
      for (const lang of langs) {
        if (!JSON.parse(doc.languages)?.includes(lang)) {
          return false
        }
      }
      for (const loc of locations) {
        if (!JSON.parse(doc.locations)?.includes(loc)) {
          return false
        }
      }
      return true
    })
  }

  const filteredDocs = useMemo(() => (filterDocs(documents, { agents, keywords, langs, locations })), [documents, agents, keywords, langs, locations])

  const navigate = useNavigate()
  const location = useLocation()
  const selection = useMemo(() => getSelection(location.pathname), [location])

  const numFilters = useMemo(() => (agents.length + keywords.length + langs.length + locations.length + tags.length), [agents, keywords, langs, locations, tags])

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
      if (filteredDocs.find(doc => (doc.id.toString() === key.toString()))) {
        p += pageCount[key]
      }
    }
    setTotalPages(p)
  }, [pageCount, tags, filteredDocs])

  const documentDetails = filteredDocs.map((doc) => {
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
            { numFilters
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
                    {numFilters}
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
          <div className="tag-filters">
            <Input placeholder="Search for filters" value={query} onChange={(e) => { setQuery(e.target.value) }} className="tag-filters-search" />
            <TagFilters
              db={db}
              filters={tags}
              query={query}
              onToggleSelected={(tagId) => {
                if (tags.includes(tagId)) {
                  setTags(current => (current.filter(t => (t !== tagId))))
                }
                else {
                  setTags(current => ([...current, tagId]))
                }
              }}
            />
            <DocumentFilters
              db={db}
              query={query}
              filters={{ agents: { data: agents, onUpdate: setAgents }, keywords: { data: keywords, onUpdate: setKeywords }, langs: { data: langs, onUpdate: setLangs }, locations: { data: locations, onUpdate: setLocations } }}
            />
          </div>
        ) }
        <Box className="surface-browser-document-details">
          { documentDetails }
        </Box>
      </Box>
    </Collapse>
  )
}

export default SurfaceBrowser
