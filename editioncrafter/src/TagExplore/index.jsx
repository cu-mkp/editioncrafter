import { useEffect, useState } from 'react'
import initSqlJs from 'sql.js'
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

function TagExplore(props) {
  const [db, setDb] = useState(null)
  const [filters, setFilters] = useState(initialFilters)

  useEffect(() => {
    const loadDb = async () => {
      const db = await initDb(props.dbUrl)
      setDb(db)
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

  if (!db) {
    return <Loading />
  }

  return (
    <div className="tag-explore">
      <TagExploreSidebar db={db} />
      <EditionCrafter {...props} />
    </div>
  )
}

export default TagExplore
