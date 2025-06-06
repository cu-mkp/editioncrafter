import { useContext, useMemo, useState } from 'react'
import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5'
import Pill from '../../common/components/Pill'
import FilterContext from '../context/FilterContext'
import PhraseList from './PhraseListTable'

function getRecordName(div) {
  if (div.element_name) {
    return `${div.element_name} - ${div.surface_name}`
  }

  return div.surface_name
}

function getTagObjects(ids, allTags) {
  return ids
    .map(xmlId => allTags.find(t => t.xml_id === xmlId))
    .filter(Boolean)
}

function getSurfaceLink(baseUrl, div, cats, tags) {
  return (
    `${baseUrl}#/ec/${div.surface_xml_id}/f/${div.surface_xml_id}/${div.layer_xml_id}?tags=${[...cats, ...tags].join(',')}`
  )
}

function PhraseToggle(props) {
  return (
    <button
      aria-label="Toggle phrases"
      className="phrase-toggle"
      onClick={props.onClick}
      type="button"
    >
      {props.toggled
        ? <IoChevronUpOutline />
        : <IoChevronDownOutline />}
    </button>
  )
}

function Record(props) {
  const [showPhrases, setShowPhrases] = useState(false)

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
          result[tag.name].phrases.push({
            name: el.element_name,
            layer: el.layer_xml_id,
          })
        }
        else {
          result[tag.name] = {
            id: tag.xml_id,
            count: 1,
            phrases: [{
              name: el.element_name,
              layer: el.layer_xml_id,
            }],
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
          href={getSurfaceLink(props.viewerUrl, props.div, ctx.categories, ctx.tags)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {getRecordName(props.div)}
        </a>
      </p>
      <div className="category-list">
        {categories.map(cat => (
          <Pill key={cat.id} label={cat.name} isActive={ctx.categories.includes(cat.xml_id)} />
        ))}
      </div>
      <div className="tag-list">
        <span className="tag-list-label">Tags</span>
        {Object.keys(tagCounts).map(tagName => (
          <Pill key={tagName} label={tagName} isActive={ctx.tags.includes(tagCounts[tagName].id)}>
            <span className="tag-count">{tagCounts[tagName].count}</span>
          </Pill>
        ))}
        <PhraseToggle
          toggled={showPhrases}
          onClick={() => setShowPhrases(!showPhrases)}
        />
      </div>
      <PhraseList
        tagCounts={tagCounts}
        elements={props.childElements}
        visible={showPhrases}
      />
    </div>
  )
}

export default Record
