import { useEffect, useState } from 'react'
import { HashRouter } from 'react-router-dom'
import initSqlJs from 'sql.js'
import sqlJsInfo from 'sql.js/package.json'
import LoadingSplash from '../common/components/LoadingSplash'
import { fetchCachedAsset } from '../common/lib/assetCache'
import { getObjs } from '../common/lib/sql'
import EditionCrafter from '../EditionCrafter'
import TagFilterProvider from '../EditionCrafter/context/TagFilter'
import TagExploreSidebar from './components/TagExploreSidebar'
import './styles/base.css'

const initialFilters = {
  categories: [],
  tags: [],
}

const SQL_WASM_URL = `https://cdnjs.cloudflare.com/ajax/libs/sql.js/${sqlJsInfo.version}/sql-wasm.wasm`

async function initDb(url, onProgress) {
  const [dbBuffer, wasmBinary] = await Promise.all([
    fetchCachedAsset(url, {
      onProgress: (loaded, total) => onProgress?.('db', loaded, total),
    }),
    fetchCachedAsset(SQL_WASM_URL, {
      onProgress: (loaded, total) => onProgress?.('wasm', loaded, total),
    }),
  ])

  const SQL = await initSqlJs({ wasmBinary })
  return new SQL.Database(new Uint8Array(dbBuffer))
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
  const { documentName, baseURL, transcriptionTypes, manifestPath = '/iiif/manifest.json' } = props
  const documentInfo = {}

  for (const document of documents) {
    documentInfo[document.local_id] = {
      documentName: document.name,
      transcriptionTypes,
      iiifManifest: `${baseURL}/${document.local_id}${manifestPath}`,
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
  const [progress, setProgress] = useState({
    db: { loaded: 0, total: 0 },
    wasm: { loaded: 0, total: 0 },
  })

  useEffect(() => {
    const loadDb = async () => {
      const db = await initDb(props.dbUrl, (key, loaded, total) => {
        setProgress(current => ({ ...current, [key]: { loaded, total } }))
      })
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
    const totalLoaded = progress.db.loaded + progress.wasm.loaded
    const totalSize = progress.db.total + progress.wasm.total
    const percent = totalSize > 0 ? (totalLoaded / totalSize) * 100 : null

    return <LoadingSplash label="Loading edition…" percent={percent} />
  }

  return (
    <div className="tag-explore">
      <HashRouter>
        <TagFilterProvider>
          <TagExploreSidebar db={db} />
          <EditionCrafter {...ecProps} />
        </TagFilterProvider>
      </HashRouter>
    </div>
  )
}

export default TagExplore
