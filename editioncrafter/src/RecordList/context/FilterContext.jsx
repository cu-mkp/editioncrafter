import { createContext } from 'react'

const FilterContext = createContext({
  categories: [],
  tags: [],
})

export default FilterContext
