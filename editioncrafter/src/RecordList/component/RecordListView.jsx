import { useMemo } from 'react'
import { getObjs } from '../lib/sql'
import Record from './Record'

function getData(db) {
  const elementsStmt = db.prepare(`
  SELECT
    elements.id AS id,
    elements.name AS element_name,
    elements.type AS element_type,
    surfaces.name AS surface_name,
    GROUP_CONCAT(tags.id) as tagging_ids
  FROM
    taggings
  INNER JOIN elements
    ON elements.id = taggings.element_id
  INNER JOIN tags
    ON tags.id = taggings.tag_id
  INNER JOIN surfaces
    ON surfaces.id = elements.surface_id
  GROUP BY elements.id`)

  const tagsStmt = db.prepare('SELECT * from tags')

  return {
    elements: getObjs(elementsStmt),
    tags: getObjs(tagsStmt),
  }
}

function RecordListView(props) {
  const { elements, tags } = useMemo(() => getData(props.db), [props.db])

  // const divs = useMemo(() => {
  //   const divTaggings = taggings.filter(t => t.element_type === 'div')
  //   const segTaggings = taggings.filter(t => t.element_type === 'seg')

  //   const divData = {}
  //   divXmlIds.forEach(id => {
  //     if (divData)
  //   })
  // }, [taggings])

  const divs = useMemo(() => elements.filter(el => el.element_type === 'div'), [elements])

  return (
    <div className="record-list-view">
      <h1 className="entries-header">
        Records (
        {divs.length}
        )
      </h1>
      {divs.map(div => (
        <Record div={div} key={div.id} tags={tags} />
      ))}
    </div>
  )
}

export default RecordListView
