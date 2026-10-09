import { createContext } from 'react'

const TagFilterContext = createContext({
  tagsLeft: [],
  tagsRight: [],
  toggleTag: () => null,
  clearTags: () => null,
})

export default TagFilterContext
