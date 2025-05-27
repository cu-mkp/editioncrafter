import { useContext, useMemo } from 'react'
import { getObjs } from '../../common/lib/sql'
import FilterContext from '../context/FilterContext'
import Record from './Record'

function cleanUpTagIds(obj) {
  return {
    ...obj,
    tagging_ids: obj.tagging_ids.split(','),
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
    surfaces.xml_id AS surface_xml_id,
    layers.xml_id AS layer_xml_id,
    GROUP_CONCAT(tags.xml_id) as tagging_ids
  FROM
    taggings
  INNER JOIN elements
    ON elements.id = taggings.element_id
  INNER JOIN tags
    ON tags.id = taggings.tag_id
  INNER JOIN surfaces
    ON surfaces.id = elements.surface_id
  INNER JOIN layers
    ON layers.id = elements.layer_id
  GROUP BY elements.id`)

  const tagsStmt = db.prepare('SELECT * from tags')

  return {
    elements: getObjs(elementsStmt).map(cleanUpTagIds),
    tags: getObjs(tagsStmt),
  }
}

function isFilterMatch(ctx, divData) {
  const categoryMatch = (ctx.categories.length === 0
    || divData.element.tagging_ids.some(id => ctx.categories.includes(id)))

  const tagMatch = (ctx.tags.length === 0
    || divData.childTags.some(id => ctx.tags.includes(id)))

  return categoryMatch && tagMatch
}

function RecordListView(props) {
  const ctx = useContext(FilterContext)

  const { elements, tags } = useMemo(() => getData(props.db), [props.db])

  const divs = useMemo(() => {
    const arr = []

    for (const element of elements) {
      if (element.element_type !== 'div') {
        continue
      }

      const children = elements.filter(childEl => childEl.parent_id === element.id)
      const childTags = children.flatMap(childEl => childEl.tagging_ids)

      arr.push({
        element,
        children,
        childTags,
      })
    }

    return arr
  }, [elements])

  return (
    <div className="record-list-view">
      <h1 className="entries-header">
        {props.recordLabel || 'Records'}
        {' '}
        (
        {divs.length}
        )
      </h1>
      {divs.map((divData) => {
        if (isFilterMatch(ctx, divData)) {
          return (
            <Record
              childElements={elements.filter(el => el.parent_id === divData.element.id)}
              div={divData.element}
              key={divData.element.id}
              tags={tags}
              viewerUrl={props.viewerUrl}
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
