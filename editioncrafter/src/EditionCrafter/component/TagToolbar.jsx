import { useContext } from 'react'
import { BsCheck, BsX } from 'react-icons/bs'
import { GoTag } from 'react-icons/go'
import TagFilterContext from '../context/TagFilterContext'

function TagPill(props) {
  return (
    <button
      className={props.isActive ? 'active' : ''}
      onClick={props.onClick}
      type="button"
    >
      {props.isActive && <BsCheck />}
      {props.name}
    </button>
  )
}

function TagToolbar(props) {
  const { tags, toggleTag } = useContext(TagFilterContext)

  return (
    <div className="tag-bar">
      <div className="tag-list">
        <span className="tag-label">
          <GoTag />
          Tags
        </span>
        {props.folio.tagIds.map((xmlId) => {
          const name = props.document.tags[xmlId]

          if (name) {
            return (
              <TagPill
                isActive={tags.includes(xmlId)}
                key={xmlId}
                name={name}
                onClick={() => toggleTag(xmlId)}
              />
            )
          }

          return null
        })}
      </div>
      <button
        className="tag-bar-close"
        onClick={props.toggleTags}
        type="button"
      >
        <BsX />
      </button>
    </div>
  )
}

export default TagToolbar
