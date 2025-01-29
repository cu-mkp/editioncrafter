import { useMemo } from 'react'
import Pill from '../../common/components/Pill'
import { getObjs } from '../../common/lib/sql'

function getData(db) {
  const taxonomiesStmt = db.prepare(`
    SELECT
      *
    FROM
      taxonomies;
  `)

  const tagsStmt = db.prepare(`
    SELECT
      tags.id AS id,
      tags.name AS name,
      tags.xml_id AS xml_id
    FROM
      tags
    INNER JOIN taggings
      ON taggings.tag_id = tags.id
    INNER JOIN elements
      ON elements.id = taggings.element_id
    WHERE
      elements.type = 'zone'
    GROUP BY
      tags.xml_id`)

  return {
    tags: getObjs(tagsStmt),
    taxonomies: getObjs(taxonomiesStmt),
  }
}

function TagFilters(props) {
  const data = useMemo(() => getData(props.db), [props.db])

  return (
    <div className="tag-filters">
      <div className="tag-list">
        {data.tags.map(tag => (
          <Pill
            key={tag.key}
            label={tag.name}
          />
        ))}
      </div>
    </div>
  )
}

export default TagFilters
