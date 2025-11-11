import { Checkbox, FormControlLabel, FormGroup, Typography } from '@material-ui/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getObjs } from '../../common/lib/sql'

function getData(db) {
  const rolesStmt = db.prepare(`
    SELECT * FROM roles
    `)
  const agentStmt = db.prepare(`
        SELECT
          people.name as name,
          roles.name as role,
          people.id as person_id,
          roles.id as role_id
        FROM
          agents
        LEFT JOIN people
          ON people.id = agents.person
        LEFT JOIN roles
          ON roles.id = agents.role
        GROUP BY
          roles.name, people.name, people.id, roles.id
    `)

  const keywordsStmt = db.prepare(`
      SELECT * FROM keywords
    `)

  const typesStmt = db.prepare(`
    SELECT type FROM keywords GROUP BY type
    `)

  const langStmt = db.prepare(`SELECT * FROM languages`)
  const locStmt = db.prepare(`SELECT * FROM locations`)

  return {
    agents: getObjs(agentStmt),
    roles: getObjs(rolesStmt),
    types: getObjs(typesStmt),
    keywords: getObjs(keywordsStmt),
    languages: getObjs(langStmt),
    locations: getObjs(locStmt),
  }
}

function DocumentFilters(props) {
  const { filters, query } = props
  const fullData = useMemo(() => getData(props.db), [props.db])
  const [expanded, setExpanded] = useState(fullData.roles?.map(() => (false)))
  const [keywordExpanded, setKeywordExpanded] = useState(fullData.types?.map(() => (false)))
  const [langExpanded, setLangExpanded] = useState(false)
  const [locExpanded, setLocExpanded] = useState(false)
  const [displayedTags, setDisplayedTags] = useState({})

  const data = useMemo(() => {
    const agents = fullData.agents?.filter(ag => (!query || !query.length || ag.name?.toLowerCase().includes(query.toLowerCase())))
    const keywords = fullData.keywords?.filter(term => (!query || !query.length || term.name?.toLowerCase().includes(query.toLowerCase())))
    const languages = fullData.languages?.filter(lang => (!query || !query.length || lang.name.toLowerCase().includes(query.toLowerCase())))
    const locations = fullData.locations?.filter(loc => (!query || !query.length || loc.name.toLowerCase().includes(query.toLowerCase())))
    return ({
      agents,
      keywords,
      languages,
      locations,
      types: fullData.types,
      roles: fullData.roles,
    })
  }, [fullData, query])

  useEffect(() => {
    const tags = {}
    for (let i = 0; i < data.roles.length; i++) {
      const tax = data.roles[i]
      const tagList = expanded[i] ? data.agents.filter(t => (t.role_id === tax.id)) : data.agents.filter(t => (t.role_id === tax.id))?.slice(0, 5)
      tags[tax.id] = tagList
    }
    setDisplayedTags(tags)
  }, [expanded, data])

  const onToggleAgent = useCallback((role, person) => {
    const current = [...filters.agents.data]
    if (current.find(f => (f.role === role && f.person === person))) {
      filters.agents.onUpdate(current => (current.filter(item => (item.role !== role || item.person !== person))))
    }
    else {
      filters.agents.onUpdate(current => [...current, { role, person }])
    }
  }, [filters])

  const onToggleKeyword = useCallback((type, term) => {
    const current = [...filters.keywords.data]
    if (current.find(f => (f.type === type && f.term === term))) {
      filters.keywords.onUpdate(current => (current.filter(item => (item.type !== type || item.term !== term))))
    }
    else {
      filters.keywords.onUpdate(current => [...current, { type, term }])
    }
  }, [filters])

  const onToggleLanguage = useCallback((item_id) => {
    const current = [...filters.langs.data]
    if (current.includes(item_id)) {
      filters.langs.onUpdate(current => (current.filter(i => (i !== item_id))))
    }
    else {
      filters.langs.onUpdate(current => [...current, item_id])
    }
  }, [filters])

  const onToggleLocation = useCallback((item_id) => {
    const current = [...filters.locations.data]
    if (current.includes(item_id)) {
      filters.locations.onUpdate(current => (current.filter(i => (i !== item_id))))
    }
    else {
      filters.locations.onUpdate(current => [...current, item_id])
    }
  }, [filters])

  return (
    <div className="tag-list">
      <FormGroup>
        { data.roles.map((tax, idx) => {
          const tagList = displayedTags[tax.id]
          return tagList?.length
            ? (
                <div key={tax.id}>
                  <Typography>{tax.name}</Typography>
                  <ul>
                    { tagList?.map(tag => (
                      <FormControlLabel
                        as="li"
                        control={(
                          <Checkbox
                            checked={!!filters.agents.data.find(ag => (ag.role === tax.id && ag.person === tag.person_id))}
                            onChange={() => {
                              onToggleAgent(tax.id, tag.person_id)
                            }}
                          />
                        )}
                        key={tag.person_id}
                        label={tag.name}
                      />
                    ))}
                  </ul>
                  { (data.agents.filter(t => (t.role_id === tax.id))?.length && data.agents.filter(t => (t.role_id === tax.id)).length >= 6)
                    ? (
                        <button
                          className="tag-filter-button"
                          type="button"
                          onClick={() => {
                            const newState = [...expanded]
                            newState[idx] = !expanded[idx]
                            setExpanded(newState)
                          }}
                        >
                          { expanded[idx] ? 'Show less' : 'Show more'}
                        </button>
                      )
                    : null }
                </div>
              )
            : null
        })}
        { data.types.map((tax, idx) => {
          const tagList = data.keywords.filter(term => (term.type === tax.type))
          return tagList?.length
            ? (
                <div key={tax.type}>
                  <Typography>
                    {tax.type[0].toUpperCase()}
                    {tax.type.slice(1)}
                  </Typography>
                  <ul>
                    { tagList?.map(tag => (
                      <FormControlLabel
                        as="li"
                        control={(
                          <Checkbox
                            checked={!!filters.keywords.data.find(item => (item.type === tax.type && item.term === tag.id))}
                            onChange={() => {
                              onToggleKeyword(tax.type, tag.id)
                            }}
                          />
                        )}
                        key={tag.id}
                        label={tag.name}
                      />
                    ))}
                  </ul>
                  { tagList.length >= 6
                    ? (
                        <button
                          className="tag-filter-button"
                          type="button"
                          onClick={() => {
                            const newState = [...keywordExpanded]
                            newState[idx] = !keywordExpanded[idx]
                            setKeywordExpanded(newState)
                          }}
                        >
                          { keywordExpanded[idx] ? 'Show less' : 'Show more'}
                        </button>
                      )
                    : null}
                </div>
              )
            : null
        })}
        { data.languages?.length
          ? (
              <div>
                <Typography>
                  Language
                </Typography>
                <ul>
                  { data.languages.map(tag => (
                    <FormControlLabel
                      as="li"
                      control={(
                        <Checkbox
                          checked={filters.langs.data.includes(tag.id)}
                          onChange={() => {
                            onToggleLanguage(tag.id)
                          }}
                        />
                      )}
                      key={tag.id}
                      label={tag.name}
                    />
                  ))}
                </ul>
                { data.languages.length >= 6
                  ? (
                      <button
                        className="tag-filter-button"
                        type="button"
                        onClick={() => {
                          setLangExpanded(current => !current)
                        }}
                      >
                        { langExpanded ? 'Show less' : 'Show more'}
                      </button>
                    )
                  : null}
              </div>
            )
          : null }
        { data.locations?.length
          ? (
              <div>
                <Typography>
                  Location of Publication
                </Typography>
                <ul>
                  { data.locations.map(tag => (
                    <FormControlLabel
                      as="li"
                      control={(
                        <Checkbox
                          checked={filters.locations.data.includes(tag.id)}
                          onChange={() => {
                            onToggleLocation(tag.id)
                          }}
                        />
                      )}
                      key={tag.id}
                      label={tag.name}
                    />
                  ))}
                </ul>
                { data.locations.length >= 6
                  ? (
                      <button
                        className="tag-filter-button"
                        type="button"
                        onClick={() => {
                          setLocExpanded(current => !current)
                        }}
                      >
                        { locExpanded ? 'Show less' : 'Show more'}
                      </button>
                    )
                  : null}
              </div>
            )
          : null }
      </FormGroup>
    </div>
  )
}

export default DocumentFilters
