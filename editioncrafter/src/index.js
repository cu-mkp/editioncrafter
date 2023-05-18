import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import DiploMatic from './component/DiploMatic';
import { createReduxStore } from './model/ReduxStore';
import './scss/editioncrafter.scss';

/**
 * Default instantiation
 */
const EditionCrafter = (props) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#792421',
      },
      secondary: {
        main: '#EBE3DD',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <DiploMatic config={props.config} store={createReduxStore(props.config)} />
    </ThemeProvider>
  );
};

export default EditionCrafter;
