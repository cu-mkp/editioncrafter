import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import React from 'react'
import DiploMatic from './EditionCrafter/component/DiploMatic'
import { createReduxStore } from './EditionCrafter/model/ReduxStore'
import _RecordList from './RecordList'
import './EditionCrafter/scss/editioncrafter.scss'

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

  return (
    <ThemeProvider theme={theme}>
      <DiploMatic config={props} store={createReduxStore(props)} />
    </ThemeProvider>
  )
}

export { _RecordList as RecordList }

export default EditionCrafter
