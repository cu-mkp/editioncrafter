import { useMemo } from 'react'
import { getObjs } from '../../common/lib/sql'
import CollapsibleMenu from './CollapsibleMenu'
import SidebarTagList from './SidebarTagList'

function getData(db) {
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
      elements.type = 'seg'
    GROUP BY
      tags.xml_id`)

  const tags = getObjs(tagsStmt)

  const categoriesStmt = db.prepare(`
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
      elements.type = 'div'
    GROUP BY
      tags.xml_id`)

  const categories = getObjs(categoriesStmt)

  const taggingsStmt = db.prepare('SELECT * FROM taggings')
  const taggings = getObjs(taggingsStmt)

  const labeledTags = tags.map((tag) => {
    if (tag.parent_id) {
      const parent = tags.find(pt => pt.id === tag.parent_id)
      return {
        ...tag,
        name: `${parent.name} - ${tag.name}`,
      }
    }

    return tag
  })

  return {
    tags: labeledTags,
    categories,
    taggings,
  }
}

function RecordListSidebar(props) {
  const data = useMemo(() => getData(props.db), [props.db])

  return (
    <div className="ec-sidebar">
      <h2>Filters</h2>
      <div className="h-separator" />
      <CollapsibleMenu title="Categories">
        <SidebarTagList tags={data.categories} type="categories" />
      </CollapsibleMenu>
      <div className="h-separator" />
      <CollapsibleMenu title="Tags">
        <SidebarTagList tags={data.tags} type="tags" />
      </CollapsibleMenu>
    </div>
  )
}

export default RecordListSidebar
