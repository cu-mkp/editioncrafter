import { useCallback, useEffect, useMemo, useState } from 'react'
import initSqlJs from 'sql.js'
import sqlJsInfo from 'sql.js/package.json'
import Loading from '../common/components/Loading'
import RecordListView from './component/RecordListView'
import Sidebar from './component/Sidebar'
import FilterContext from './context/FilterContext'

import './styles/base.css'
import './styles/record.css'
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
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/${sqlJsInfo.version}/${file}`,
  })

  const db = new SQL.Database(arr)

  return db
}

function RecordList(props) {
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
    layers: props.layers,
  }), [filters, toggleCategoryFilter, toggleTagFilter, props.layers])

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
    <FilterContext.Provider value={initialContext}>
      <div className="editioncrafter-record-list">
        <Sidebar db={db} />
        <RecordListView
          db={db}
          recordLabel={props.recordLabel}
          viewerUrl={props.viewerUrl}
        />
      </div>
    </FilterContext.Provider>
  )
}

export default RecordList
