import { useCallback, useEffect, useMemo, useState } from 'react'
import initSqlJs from 'sql.js'
import EntryListView from './component/EntryListView'
import Loading from './component/Loading'
import Sidebar from './component/Sidebar'

import FilterContext from './context/FilterContext'
import './styles/base.css'
import './styles/entry.css'
import './styles/sidebar.css'

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

function EntryList(props) {
  const [db, setDb] = useState(null)
  const [filters, setFilters] = useState(initialFilters)

  const toggleCategoryFilter = useCallback(id => setFilters({
    ...filters,
    categories: filters.categories.includes(id)
      ? filters.categories.filter(existing => existing !== id)
      : [...filters.categories, id],
  }), [filters])

  const toggleTagFilter = useCallback(id => setFilters({
    ...filters,
    tags: filters.tags.includes(id)
      ? filters.tags.filter(existing => existing !== id)
      : [...filters.tags, id],
  }), [filters])

  const initialContext = useMemo(() => ({
    ...filters,
    toggleCategoryFilter,
    toggleTagFilter,
  }), [filters, toggleCategoryFilter, toggleTagFilter])

  useEffect(() => {
    const loadDb = async () => {
      const db = await initDb(props.dbPath)
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
  }, [props.dbPath, db])

  if (!db) {
    return <Loading />
  }

  return (
    <FilterContext.Provider value={initialContext}>
      <div className="editioncrafter-entry-list">
        <Sidebar db={db} />
        <EntryListView db={db} />
      </div>
    </FilterContext.Provider>
  )
}

export default EntryList
