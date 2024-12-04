import { useMemo } from 'react'
import { getObjs } from '../lib/sql'
import CollapsibleMenu from './CollapsibleMenu'
import SidebarTagList from './SidebarTagList'

function getData(db) {
  const tagsStmt = db.prepare('SELECT * FROM tags')
  const tags = getObjs(tagsStmt)

  const taggingsStmt = db.prepare('SELECT * FROM elements_tags')
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
    taggings,
  }
}

function EntryListSidebar(props) {
  const data = useMemo(() => getData(props.db), [props.db])
  return (
    <div className="ec-sidebar">
      <h2>Filters</h2>
      <div className="h-separator" />
      <CollapsibleMenu title="Categories">
        coming soon!
      </CollapsibleMenu>
      <div className="h-separator" />
      <CollapsibleMenu title="Tags">
        <SidebarTagList tags={data.tags} />
      </CollapsibleMenu>
    </div>
  )
}

export default EntryListSidebar
