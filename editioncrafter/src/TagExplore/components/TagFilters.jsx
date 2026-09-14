import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, FormGroup, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getObjs } from '../../common/lib/sql'
import TagFilterContext from '../../EditionCrafter/context/TagFilterContext'

function getData(db) {
  const taxonomiesStmt = db.prepare(`
    SELECT
      *
    FROM
      taxonomies;
    ORDER BY
      name ASC;
  `)

  const categoriesStmt = db.prepare(`
    SELECT
      *
    FROM 
      categories
    ORDER BY
      name ASC; 
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
      tags.xml_id
    ORDER BY
      tags.name ASC`)

  return {
    tags: getObjs(tagsStmt),
    categories: getObjs(categoriesStmt),
    taxonomies: getObjs(taxonomiesStmt),
  }
}

function getTagDocumentCount(tag, documents, db) {
  const docsStmt = db.prepare(`
    SELECT
      count(1) as count
    FROM
      document_taggings
    WHERE
      tag=${tag}${documents?.length ? ` AND document IN (${documents.join(',')})` : ''}
    `)

  try {
    const count = getObjs(docsStmt)[0]?.count
    return count
  }
  catch {
    return 1
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

  const hasDescendentTags = useCallback((catId) => {
    if (tags?.filter(tag => (tag.parent_category_id === catId))?.length) {
      return true
    }

    const subs = categories?.filter(cat => (cat.parent_category_id === catId))

    for (const sub of subs) {
      if (hasDescendentTags(sub.id)) {
        return true
      }
    }

    return false
  }, [tags, categories])

  const countDescendentTags = useCallback((catId) => {
    let count = tags?.filter(tag => (tag.parent_category_id === catId))?.length

    const subs = categories?.filter(cat => (cat.parent_category_id === catId))

    for (const sub of subs) {
      count = count + countDescendentTags(sub.id)
    }

    return count
  }, [tags, categories])

  const categoryTags = useMemo(() => {
    return tags?.filter(tag => (tag.parent_category_id === categoryId))
  }, [tags, categoryId])

  const subcategories = useMemo(() => {
    return categories?.filter(cat => (cat.parent_category_id === categoryId))
  }, [categories, categoryId])

  return hasDescendentTags(categoryId) && (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`category-tags-${name}-content`}
        id={`category-tags-${name}`}
        className="accordion-summary"
      >
        <Typography>{name}</Typography>
        <Typography>{countDescendentTags(categoryId) || ''}</Typography>
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
                label={`${tag.name} (${tag.count})`}
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
  const { onToggleSelected, filters, query, documents } = props
  const data = useMemo(() => getData(props.db), [props.db])
  const [displayedTags, setDisplayedTags] = useState({})

  const { toggleTag } = useContext(TagFilterContext)

  useEffect(() => {
    const tags = {}
    const filteredTags = data.tags.map(
      tag => ({ ...tag, count: getTagDocumentCount(tag.id, documents, props.db) }),
    ).filter(
      tag => (tag.count && (!query || !query.length || tag.name.toLowerCase().includes(query.toLowerCase()))),
    )
    for (let i = 0; i < data.taxonomies.length; i++) {
      const tax = data.taxonomies[i]
      const tagList = filteredTags.filter(t => t.taxonomy_id === tax.id)
      if (tagList?.length) {
        tags[tax.id] = tagList
      }
    }
    setDisplayedTags(tags)
  }, [data, query, documents, props.db])

  return (
    <>
      {
        data?.tags?.length
          ? (
              <div className="tag-list">
                <FormGroup>
                  { data.taxonomies.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0)).map((tax) => {
                    const tagList = displayedTags[tax.id]
                    const topLevelTags = tagList?.filter(tag => (!tag.parent_category_id))
                    return (
                      tagList?.length
                        ? (
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`tags-${tax.name}-content`}
                                id={`tags-${tax.name}`}
                                className="accordion-summary"
                              >
                                <Typography>{`${tax.name.slice(0, 1).toUpperCase()}${tax.name.slice(1)}`}</Typography>
                                <Typography>{tagList?.length || ''}</Typography>
                              </AccordionSummary>
                              <AccordionDetails
                                className="accordion-detail"
                              >
                                <div key={tax.id}>
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
                                          label={`${tag.name} (${tag.count})`}
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
                              </AccordionDetails>
                            </Accordion>
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
