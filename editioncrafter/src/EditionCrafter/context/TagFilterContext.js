import { createContext } from 'react'

const TagFilterContext = createContext({
  tagsLeft: [],
  tagsRight: [],
  toggleTag: () => null,
})

export default TagFilterContext
