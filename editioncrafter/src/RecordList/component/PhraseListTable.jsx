import { useContext, useMemo, useState } from 'react'
import Pill from '../../common/components/Pill'
import FilterContext from '../context/FilterContext'

const MAX_PHRASE_LENGTH = 20

function PhraseList(props) {
  const phraseStr = useMemo(() => {
    const arr = []

    props.phrases.forEach((phrase) => {
      if (phrase.layer !== props.layer) {
        return
      }

      if (arr.includes(phrase.name)) {
        return
      }

      if (phrase.name.length > MAX_PHRASE_LENGTH) {
        arr.push(`${phrase.name.slice(0, MAX_PHRASE_LENGTH)}...`)
      }
      else {
        arr.push(phrase.name)
      }
    })

    return arr.join('; ')
  }, [props.layer, props.phrases])

  return <p>{phraseStr}</p>
}

function PhraseListTable(props) {
  const ctx = useContext(FilterContext)

  const [layer, setLayer] = useState(Object.keys(ctx.layers)[0])

  const tagsToShow = useMemo(
    () => Object.keys(props.tagCounts).filter(tagName => props.tagCounts[tagName].phrases.some(phrase => phrase.layer === layer)),
    [layer, props.tagCounts],
  )

  return (
    <div
      className="phrase-list-table-container"
      style={{ display: props.visible ? 'initial' : 'none' }}
    >
      <div className="layer-select-container">
        <span>Layer</span>
        <select
          className="layer-select"
          onChange={e => setLayer(e.target.value)}
        >
          {Object.keys(ctx.layers).map(xmlId => (
            <option
              key={xmlId}
              value={xmlId}
            >
              {ctx.layers[xmlId]}
            </option>
          ))}
        </select>
      </div>
      <table className="phrase-list-table">
        <thead>
          <tr>
            <th>Tags for phrases</th>
            <th>
              <span>References in this layer</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tagsToShow.length === 0 && (
            <tr>
              <td colSpan={2}>
                <div className="empty-table-container">
                  No tags in this layer.
                </div>
              </td>
            </tr>
          )}
          {tagsToShow.map(tag => (
            <tr key={tag}>
              <td>
                <Pill
                  label={tag}
                  isActive={ctx.tags.includes(props.tagCounts[tag].id)}
                >
                  <span className="tag-count">{props.tagCounts[tag].count}</span>
                </Pill>
              </td>
              <td>
                <PhraseList
                  layer={layer}
                  phrases={props.tagCounts[tag].phrases}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PhraseListTable
