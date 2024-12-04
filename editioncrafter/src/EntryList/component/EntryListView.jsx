import { useMemo } from 'react'
import { getObjs } from '../lib/sql'
import Entry from './Entry'
import '../styles/entry.css'

function getData(db) {
  const elementsStmt = db.prepare(`
  SELECT
    elements_tags.id as id,
    elements.name AS element_name,
    tags.name AS tag_name,
    surfaces.name AS surface_name
  FROM
    elements_tags
  INNER JOIN elements
    ON elements.id = elements_tags.element_id
  INNER JOIN tags
    ON tags.id = elements_tags.tag_id
  INNER JOIN surfaces
    ON surfaces.id = elements.surface_id`)

  return getObjs(elementsStmt)
}

function EntryListView(props) {
  const elementTags = useMemo(() => getData(props.db), [props.db])

  return (
    <div className="entry-list-view">
      <h1 className="entries-header">
        Entries (
        {elementTags.length}
        )
      </h1>
      {elementTags.map(et => (
        <Entry elementTag={et} key={et.id} />
      ))}
    </div>
  )
}

export default EntryListView
