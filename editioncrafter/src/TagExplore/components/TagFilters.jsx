import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, FormGroup, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
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

  const categoriesStmt = db.prepare(`
    SELECT
      *
    FROM 
      categories; 
  `)

  const tagsStmt = db.prepare(`
    SELECT
      tags.id AS id,
      tags.name AS name,
      tags.xml_id AS xml_id,
      tags.parent_category_id AS parent_category_id,
      taxonomies.name as taxonomy,
      taxonomies.id as taxonomy_id
    FROM
      tags
    LEFT JOIN taxonomies
      ON tags.taxonomy_id = taxonomies.id
    GROUP BY
      tags.xml_id`)

  return {
    tags: getObjs(tagsStmt),
    categories: getObjs(categoriesStmt),
    taxonomies: getObjs(taxonomiesStmt),
  }
}

function CategoryFilter(props) {
  const {
    name,
    categoryId,
    tags,
    categories,
    toggleTag,
    onToggleSelected,
    isSurface,
    filters,
  } = props

  const categoryTags = useMemo(() => {
    return tags?.filter(tag => (tag.parent_category_id === categoryId))
  }, [tags, categoryId])

  const subcategories = useMemo(() => {
    return categories?.filter(cat => (cat.parent_category_id === categoryId))
  }, [categories, categoryId])

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`category-tags-${name}-content`}
        id={`category-tags-${name}`}
        className="accordion-summary"
      >
        <Typography>{name}</Typography>
        <Typography>{categoryTags?.length || ''}</Typography>
      </AccordionSummary>
      <AccordionDetails
        className="accordion-detail"
      >
        { !!categoryTags?.length && (
          <ul>
            { categoryTags?.map(tag => (
              <FormControlLabel
                as="li"
                control={(
                  <Checkbox
                    checked={filters.includes(tag.id)}
                    onChange={() => {
                      onToggleSelected(tag.id)
                      if (isSurface) {
                        toggleTag(tag.xml_id, 'left')
                        toggleTag(tag.xml_id, 'right')
                      }
                    }}
                  />
                )}
                key={tag.id}
                label={tag.name}
              />
            ))}
          </ul>
        )}
        {
          !!subcategories?.length && (
            <>
              {
                subcategories.map(cat => (
                  <CategoryFilter
                    key={cat.id}
                    name={cat.name}
                    categoryId={cat.id}
                    tags={tags}
                    categories={categories}
                    toggleTag={toggleTag}
                    onToggleSelected={onToggleSelected}
                    isSurface={isSurface}
                    filters={filters}
                  />
                ))
              }
            </>
          )
        }
      </AccordionDetails>
    </Accordion>
  )
}

function TagFilters(props) {
  const { onToggleSelected, filters, query } = props
  const data = useMemo(() => getData(props.db), [props.db])
  const [displayedTags, setDisplayedTags] = useState({})

  const { toggleTag } = useContext(TagFilterContext)

  useEffect(() => {
    const tags = {}
    const filteredTags = data.tags.filter(tag => (!query || !query.length || tag.name.toLowerCase().includes(query.toLowerCase())))
    for (let i = 0; i < data.taxonomies.length; i++) {
      const tax = data.taxonomies[i]
      const tagList = filteredTags.filter(t => t.taxonomy_id === tax.id)
      if (tagList?.length) {
        tags[tax.id] = tagList
      }
    }
    setDisplayedTags(tags)
  }, [data, query])

  return (
    <>
      {
        data?.tags?.length
          ? (
              <div className="tag-list">
                <FormGroup>
                  { data.taxonomies.map((tax) => {
                    const tagList = displayedTags[tax.id]
                    const topLevelTags = tagList?.filter(tag => (!tag.parent_category_id))
                    return (
                      tagList?.length
                        ? (
                            <div key={tax.id}>
                              <Typography>{`${tax.name.slice(0, 1).toUpperCase()}${tax.name.slice(1)}`}</Typography>
                              { !!topLevelTags?.length && (
                                <ul>
                                  { topLevelTags?.map(tag => (
                                    <FormControlLabel
                                      as="li"
                                      control={(
                                        <Checkbox
                                          checked={filters.includes(tag.id)}
                                          onChange={() => {
                                            onToggleSelected(tag.id)
                                            if (tax.is_surface) {
                                              toggleTag(tag.xml_id, 'left')
                                              toggleTag(tag.xml_id, 'right')
                                            }
                                          }}
                                        />
                                      )}
                                      key={tag.id}
                                      label={tag.name}
                                    />
                                  ))}
                                </ul>
                              )}
                              {
                                data.categories?.filter(cat => (cat.taxonomy_id === tax.id && !cat.parent_category_id))?.map(cat => (
                                  <CategoryFilter
                                    key={cat.id}
                                    name={cat.name}
                                    categoryId={cat.id}
                                    tags={tagList}
                                    categories={data.categories}
                                    toggleTag={toggleTag}
                                    onToggleSelected={onToggleSelected}
                                    isSurface={tax.is_surface}
                                    filters={filters}
                                  />
                                ))
                              }
                            </div>
                          )
                        : null
                    )
                  })}
                </FormGroup>
              </div>
            )
          : null
      }
    </>
  )
}

export default TagFilters
