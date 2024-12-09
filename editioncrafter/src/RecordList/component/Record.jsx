import { useMemo } from 'react'
import Pill from './Pill'

function getRecordName(div) {
  if (div.element_name) {
    return `${div.element_name} - ${div.surface_name}`
  }

  return div.surface_name
}

function Record(props) {
  const categories = useMemo(() => props.div.tagging_ids
    .split(',')
    .map(id => props.tags.find(t => t.id === Number.parseInt(id)))
    .filter(Boolean), [props.div.tagging_ids, props.tags])

  return (
    <div className="record-box">
      <p>
        <a href="#todo">
          {getRecordName(props.div)}
        </a>
      </p>
      <div className="category-list">
        {categories.map(cat => (
          <Pill key={cat.id} label={cat.name} />
        ))}
      </div>
      <div className="tag-list">
        <p>tag pills go here</p>
      </div>
    </div>
  )
}

export default Record
