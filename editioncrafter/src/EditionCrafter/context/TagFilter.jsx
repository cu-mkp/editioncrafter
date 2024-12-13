import { useMemo, useState } from 'react'
import TagFilterContext from './TagFilterContext'

function TagFilterProvider(props) {
  const [tags, setTags] = useState([])

  const ctxValue = useMemo(() => {
    const toggleTag = (name) => {
      if (tags.includes(name)) {
        setTags(tags.filter(t => t !== name))
      }
      else {
        setTags([...tags, name])
      }
    }

    return {
      tags,
      toggleTag,
    }
  }, [tags])

  return (
    <TagFilterContext.Provider value={ctxValue}>
      {props.children}
    </TagFilterContext.Provider>
  )
}

export default TagFilterProvider
