import { useEffect, useMemo, useState } from 'react'
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import TagFilterContext from './TagFilterContext'

function getTagsFromParams(val) {
  if (val && val !== 'null') {
    return val.split(',')
  }

  return []
}

function TagFilterProvider(props) {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [tags, setTags] = useState(getTagsFromParams(searchParams.get('tags')))

  const tagParams = searchParams.get('tags')

  useEffect(() => {
    const newTags = getTagsFromParams(tagParams)
    setTags(newTags)
  }, [tagParams])

  const ctxValue = useMemo(() => {
    const toggleTag = (xmlId) => {
      if (tags.includes(xmlId)) {
        const oldTags = getTagsFromParams(tagParams)
        const newTags = oldTags.filter(t => t !== xmlId)
        searchParams.set('tags', newTags.join(','))
        setTags(newTags)
        navigate(`${location.pathname}?${createSearchParams(searchParams.toString())}`)
      }
      else {
        searchParams.set('tags', `${tagParams},${xmlId}`)
        setTags([...tags, xmlId])
        navigate(`${location.pathname}?${createSearchParams(searchParams.toString())}`)
      }
    }

    return {
      tags,
      toggleTag,
    }
  }, [location.pathname, navigate, searchParams, tagParams, tags])

  return (
    <TagFilterContext.Provider value={ctxValue}>
      {props.children}
    </TagFilterContext.Provider>
  )
}

export default TagFilterProvider
