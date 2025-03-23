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

  const [tagsLeft, setTagsLeft] = useState(getTagsFromParams(searchParams.get('tagsLeft')))
  const [tagsRight, setTagsRight] = useState(getTagsFromParams(searchParams.get('tagsRight')))

  const tagParamsLeft = searchParams.get('tagsLeft')
  const tagParamsRight = searchParams.get('tagsRight')

  useEffect(() => {
    const newTags = getTagsFromParams(tagParamsLeft)
    setTagsLeft(newTags)
  }, [tagParamsLeft])

  useEffect(() => {
    const newTags = getTagsFromParams(tagParamsRight)
    setTagsRight(newTags)
  }, [tagParamsRight])

  const ctxValue = useMemo(() => {
    const toggleTag = (xmlId, side) => {
      const tags = side === 'right' ? tagsRight : tagsLeft
      const tagParams = side === 'right' ? tagParamsRight : tagParamsLeft
      const setTags = side === 'right' ? setTagsRight : setTagsLeft
      if (tags.includes(xmlId)) {
        const oldTags = getTagsFromParams(tagParams)
        const newTags = oldTags.filter(t => t !== xmlId)
        searchParams.set(`tags${side === 'right' ? 'Right' : 'Left'}`, newTags.join(','))
        setTags(newTags)
        navigate(`${location.pathname}?${createSearchParams(searchParams.toString())}`)
      }
      else {
        searchParams.set(`tags${side === 'right' ? 'Right' : 'Left'}`, `${tagParams},${xmlId}`)
        setTags([...tags, xmlId])
        navigate(`${location.pathname}?${createSearchParams(searchParams.toString())}`)
      }
    }

    return {
      tagsLeft,
      tagsRight,
      toggleTag,
    }
  }, [location.pathname, navigate, searchParams, tagParamsLeft, tagParamsRight, tagsLeft, tagsRight])

  return (
    <TagFilterContext.Provider value={ctxValue}>
      {props.children}
    </TagFilterContext.Provider>
  )
}

export default TagFilterProvider
