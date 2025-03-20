import { Checkbox, FormControlLabel, FormGroup, Typography } from '@material-ui/core'
import { useMemo } from 'react'
import { getObjs } from '../../common/lib/sql'

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

  return (
    <div className="tag-filters">
      <div className="tag-list">
        <FormGroup>
          { data.taxonomies.map(tax => (
            <div key={tax.id}>
              <Typography>{tax.name}</Typography>
              <ul>
                { data.tags.map(tag => (
                  <FormControlLabel as="li" control={<Checkbox checked={filters.includes(tag.id)} onChange={() => onToggleSelected(tag.id)} />} key={tag.id} label={tag.name} />
                ))}
              </ul>
            </div>
          ))}
        </FormGroup>
      </div>
    </div>
  )
}

export default TagFilters
