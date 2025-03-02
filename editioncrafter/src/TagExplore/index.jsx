import { useEffect, useState } from 'react'
import initSqlJs from 'sql.js'
import { getObjs } from '../common/lib/sql'
import Loading from '../common/components/Loading'
import EditionCrafter from '../EditionCrafter'
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

  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`,
  })

  const db = new SQL.Database(arr)

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

function generateECProps(props,db) {
  const documents = getData(db)
  const { documentName, baseURL, transcriptionTypes } = props
  const documentInfo = {}

  for( const document of documents ) {
    documentInfo[document.local_id] = {
      documentName: document.name,
      transcriptionTypes,
      iiifManifest: `${baseURL}/${document.local_id}/iiif/manifest.json`
    }
  }

  return {
    documentName,
    documentInfo,
  }
}

function TagExplore(props) {
  const [db, setDb] = useState(null)
  const [ecProps,setECProps] = useState(null)
  const [filters, setFilters] = useState(initialFilters)

  useEffect(() => {
    const loadDb = async () => {
      const db = await initDb(props.dbUrl)
      const ecProps = generateECProps(props,db)
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
      <TagExploreSidebar db={db} />
      <EditionCrafter {...ecProps} />
    </div>
  )
}

export default TagExplore
