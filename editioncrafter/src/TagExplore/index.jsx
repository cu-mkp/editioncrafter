import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import initSqlJs from 'sql.js'
import sqlJsInfo from 'sql.js/package.json'
import Loading from '../common/components/Loading'
import { getObjs } from '../common/lib/sql'
import EditionCrafter from '../EditionCrafter'
import TagFilterProvider from '../EditionCrafter/context/TagFilter'
import TagExploreSidebar from './components/TagExploreSidebar'
import './styles/base.css'

const initialFilters = {
  categories: [],
  tags: [],
}

async function initDb(url) {
  const file = await fetch(url)

  if (!file.ok) {
    throw new Error('Failed fetching SQLite file.')
  }

  const buf = await file.arrayBuffer()
  const arr = new Uint8Array(buf)

  const db = await initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/${sqlJsInfo.version}/${file}`,
  }).then((SQL) => {
    const db = new SQL.Database(arr)
    return db
  })

  return db
}

function getData(db) {
  const documentStmt = db.prepare(`
    SELECT
      documents.name AS name,
      documents.local_id AS local_id
    FROM
      documents
  `)

  return getObjs(documentStmt)
}

function generateECProps(props, db) {
  const documents = getData(db)
  const { documentName, baseURL, transcriptionTypes } = props
  const documentInfo = {}

  for (const document of documents) {
    documentInfo[document.local_id] = {
      documentName: document.name,
      transcriptionTypes,
      iiifManifest: `${baseURL}/${document.local_id}/iiif/manifest.json`,
    }
  }

  return {
    documentName,
    documentInfo,
    tagExplorerMode: true,
  }
}

function TagExplore(props) {
  const [db, setDb] = useState(null)
  const [ecProps, setECProps] = useState(null)
  const [filters, setFilters] = useState(initialFilters)

  const Router = useMemo(() => props.serverNav ? BrowserRouter : HashRouter, [props.serverNav])

  useEffect(() => {
    const loadDb = async () => {
      const db = await initDb(props.dbUrl)
      const ecProps = generateECProps(props, db)
      setDb(db)
      setECProps(ecProps)
    }

    if (!db) {
      loadDb()
    }

    return () => {
      if (db) {
        db.close()
      }
    }
  }, [props.dbUrl, db])

  if (!db || !ecProps) {
    return <Loading />
  }

  return (
    <div className="tag-explore">
      <Router>
        <TagFilterProvider>
          <TagExploreSidebar db={db} />
          <EditionCrafter {...ecProps} />
        </TagFilterProvider>
      </Router>
    </div>
  )
}

export default TagExplore
