import { BsX } from 'react-icons/bs'
import { GoTag } from 'react-icons/go'

function TagPill(props) {
  return (
    <button type="button">
      {props.name}
    </button>
  )
}

function TagToolbar(props) {
  return (
    <div className="tag-bar">
      <div className="tag-list">
        <span className="tag-label">
          <GoTag />
          Tags
        </span>

        {Object.keys(props.document.tags).map(xmlId => (
          <TagPill
            key={xmlId}
            name={props.document.tags[xmlId]}
          />
        ))}
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
