import { useMemo } from 'react'
import { getObjs } from '../lib/sql'
import '../styles/sidebar.css'

function getData(db) {
  const categoriesStmt = db.prepare('SELECT * FROM tags')
  const categories = getObjs(categoriesStmt)

  const zonesStmt = db.prepare('SELECT * FROM elements_tags')
  const zoneTags = getObjs(zonesStmt)

  return {
    categories,
    zoneTags,
  }
}

function EntryListSidebar(props) {
  const data = useMemo(() => getData(props.db), [props.db])
  return (
    <div className="ec-sidebar">
      <h2>Filters</h2>
      <div>
        <h3>Category</h3>
        {data.categories.map(cat => (
          <button key={cat.id} type="button">{cat.name}</button>
        ))}
      </div>
    </div>
  )
}

export default EntryListSidebar
