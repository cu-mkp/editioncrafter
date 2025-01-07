import { createContext } from 'react'

const TagFilterContext = createContext({
  tags: [],
  toggleTag: () => null,
})

export default TagFilterContext
