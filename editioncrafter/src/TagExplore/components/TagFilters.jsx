import { Checkbox, FormControlLabel, FormGroup, Typography } from '@material-ui/core'
import { useContext, useEffect, useMemo, useState } from 'react'
import { getObjs } from '../../common/lib/sql'
import TagFilterContext from '../../EditionCrafter/context/TagFilterContext'

function getData(db) {
  const taxonomiesStmt = db.prepare(`
    SELECT
      *
    FROM
      taxonomies;
  `)

  const tagsStmt = db.prepare(`
    SELECT
      tags.id AS id,
      tags.name AS name,
      tags.xml_id AS xml_id,
      taxonomies.name as taxonomy,
      taxonomies.id as taxonomy_id
    FROM
      tags
    LEFT JOIN taxonomies
      ON tags.taxonomy_id = taxonomies.id
    INNER JOIN taggings
      ON taggings.tag_id = tags.id
    INNER JOIN elements
      ON elements.id = taggings.element_id
    WHERE
      elements.type = 'zone'
    GROUP BY
      tags.xml_id`)

  return {
    tags: getObjs(tagsStmt),
    taxonomies: getObjs(taxonomiesStmt),
  }
}

function TagFilters(props) {
  const { onToggleSelected, filters } = props
  const data = useMemo(() => getData(props.db), [props.db])
  const [expanded, setExpanded] = useState(data.taxonomies?.map(() => (false)))
  const [displayedTags, setDisplayedTags] = useState({})

  const { toggleTag } = useContext(TagFilterContext)

  useEffect(() => {
    const tags = {}
    for (let i = 0; i < data.taxonomies.length; i++) {
      const tax = data.taxonomies[i]
      const tagList = expanded[i] ? data.tags.filter(t => (t.taxonomy_id === tax.id)) : data.tags.filter(t => (t.taxonomy_id === tax.id))?.slice(0, 5)
      tags[tax.id] = tagList
    }
    setDisplayedTags(tags)
  }, [expanded, data])

  return (
    <div className="tag-filters">
      <div className="tag-list">
        <FormGroup>
          { data.taxonomies.map((tax, idx) => {
            const tagList = displayedTags[tax.id]
            return (
              <div key={tax.id}>
                <Typography>{tax.name}</Typography>
                <ul>
                  { tagList?.map(tag => (
                    <FormControlLabel
                      as="li"
                      control={(
                        <Checkbox
                          checked={filters.includes(tag.id)}
                          onChange={() => {
                            onToggleSelected(tag.id)
                            toggleTag(tag.xml_id, 'left')
                            toggleTag(tag.xml_id, 'right')
                          }}
                        />
                      )}
                      key={tag.id}
                      label={tag.name}
                    />
                  ))}
                </ul>
                <button
                  className="tag-filter-button"
                  type="button"
                  onClick={() => {
                    const newState = [...expanded]
                    newState[idx] = !expanded[idx]
                    setExpanded(newState)
                  }}
                >
                  { !data.tags.filter(t => (t.taxonomy_id === tax.id))?.length || data.tags.filter(t => (t.taxonomy_id === tax.id)).length < 6 ? null : expanded[idx] ? 'Show less' : 'Show more'}
                </button>
              </div>
            )
          })}
        </FormGroup>
      </div>
    </div>
  )
}

export default TagFilters
