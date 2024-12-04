import { useContext, useMemo } from 'react'
import FilterContext from '../context/FilterContext'
import Pill from './Pill'

function TagPill(props) {
  const { tags, toggleTagFilter } = useContext(FilterContext)

  const isActive = useMemo(() => tags.includes(props.tag.id), [tags, props.tag])

  return (
    <Pill
      isActive={isActive}
      onClick={() => toggleTagFilter(props.tag.id)}
      label={props.tag.name}
    />
  )
}

function SidebarTagList(props) {
  return (
    <div className="sidebar-tag-list">
      {props.tags.map(tag => (
        <TagPill key={tag.id} tag={tag} />
      ))}
    </div>
  )
}

export default SidebarTagList
