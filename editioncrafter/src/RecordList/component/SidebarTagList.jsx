import { useContext, useMemo } from 'react'
import { IoCheckmarkSharp } from 'react-icons/io5'
import FilterContext from '../context/FilterContext'
import Pill from './Pill'

function TagPill(props) {
  const { categories, toggleCategoryFilter, tags, toggleTagFilter } = useContext(FilterContext)

  const toggleFilter = props.type === 'categories'
    ? toggleCategoryFilter
    : toggleTagFilter

  const isActive = useMemo(() => props.type === 'categories'
    ? categories.includes(props.tag.id)
    : tags.includes(props.tag.id), [props.type, props.tag.id, tags, categories])

  return (
    <Pill
      isActive={isActive}
      onClick={() => toggleFilter(props.tag.id)}
      label={props.tag.name}
    >
      {isActive && <IoCheckmarkSharp />}
    </Pill>
  )
}

function SidebarTagList(props) {
  return (
    <div className="sidebar-tag-list">
      {props.tags.map(tag => (
        <TagPill key={tag.id} type={props.type} tag={tag} />
      ))}
    </div>
  )
}

export default SidebarTagList
