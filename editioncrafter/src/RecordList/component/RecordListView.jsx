import { useContext, useMemo } from 'react'
import FilterContext from '../context/FilterContext'
import { getObjs } from '../lib/sql'
import Record from './Record'

function cleanUpTagIds(obj) {
  return {
    ...obj,
    tagging_ids: obj.tagging_ids.split(',').map(id => Number.parseInt(id)),
  }
}

function getData(db) {
  const elementsStmt = db.prepare(`
  SELECT
    elements.id AS id,
    elements.name AS element_name,
    elements.type AS element_type,
    elements.parent_id AS parent_id,
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
    elements: getObjs(elementsStmt).map(cleanUpTagIds),
    tags: getObjs(tagsStmt),
  }
}

function RecordListView(props) {
  const ctx = useContext(FilterContext)

  const { elements, tags } = useMemo(() => getData(props.db), [props.db])

  const divs = useMemo(() => elements
    .filter(el => el.element_type === 'div'), [elements])

  return (
    <div className="record-list-view">
      <h1 className="entries-header">
        Records (
        {divs.length}
        )
      </h1>
      {divs
        .map((div) => {
          if (ctx.categories.length === 0 || div.tagging_ids.some(id => ctx.categories.includes(id))) {
            return (
              <Record
                childElements={elements.filter(el => el.parent_id === div.id)}
                div={div}
                key={div.id}
                tags={tags}
              />
            )
          }

          return null
        },
        )}
    </div>
  )
}

export default RecordListView
