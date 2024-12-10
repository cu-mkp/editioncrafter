import { useContext, useMemo } from 'react'
import FilterContext from '../context/FilterContext'
import Pill from './Pill'

function getRecordName(div) {
  if (div.element_name) {
    return `${div.element_name} - ${div.surface_name}`
  }

  return div.surface_name
}

function getTagObjects(ids, allTags) {
  return ids
    .map(id => allTags.find(t => t.id === id))
    .filter(Boolean)
}

function getSurfaceLink(baseUrl, div) {
  return (
    `${baseUrl}&viewMode=story#/ec/${div.surface_xml_id}/f/${div.surface_xml_id}/${div.layer_xml_id}`
  )
}

function Record(props) {
  const ctx = useContext(FilterContext)

  const categories = useMemo(
    () => getTagObjects(props.div.tagging_ids, props.tags),
    [props.div.tagging_ids, props.tags],
  )

  const tagCounts = useMemo(() => {
    const result = {}

    props.childElements.forEach((el) => {
      const tags = getTagObjects(el.tagging_ids, props.tags)
      tags.forEach((tag) => {
        if (result[tag.name]) {
          result[tag.name].count++
        }
        else {
          result[tag.name] = {
            id: tag.id,
            count: 1,
          }
        }
      })
    })

    return result
  }, [props.childElements, props.tags])

  return (
    <div className="record-box">
      <p>
        <a
          href={getSurfaceLink(props.viewerUrl, props.div)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {getRecordName(props.div)}
        </a>
      </p>
      <div className="category-list">
        {categories.map(cat => (
          <Pill key={cat.id} label={cat.name} isActive={ctx.categories.includes(cat.id)} />
        ))}
      </div>
      <div className="tag-list">
        {Object.keys(tagCounts).map(tagName => (
          <Pill key={tagName} label={tagName} isActive={ctx.tags.includes(tagCounts[tagName].id)}>
            <span className="tag-count">{tagCounts[tagName].count}</span>
          </Pill>
        ))}
      </div>
    </div>
  )
}

export default Record
