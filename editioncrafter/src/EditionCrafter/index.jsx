import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import React from 'react'
import DiploMatic from './component/DiploMatic'
import { createReduxStore } from './model/ReduxStore'
import './scss/editioncrafter.scss'

/**
 * Default instantiation
 */
function EditionCrafter(props) {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#792421',
      },
      secondary: {
        main: '#EBE3DD',
      },
    },
  })

  const tagExplorerMode = props.tagExplorerMode === true

  return (
    <ThemeProvider theme={theme}>
      <DiploMatic config={props} store={createReduxStore(props)} tagExplorerMode={tagExplorerMode} />
    </ThemeProvider>
  )
}

export default EditionCrafter
