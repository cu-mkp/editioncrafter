import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import DiploMatic from './component/DiploMatic';
import { createReduxStore } from './model/ReduxStore';

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
    <div>
      <ThemeProvider theme={theme}>
        <DiploMatic config={props.config} store={createReduxStore(props.config)} />
      </ThemeProvider>
    </div>
  );
};

export default EditionCrafter;
