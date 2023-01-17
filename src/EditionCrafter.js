import React from 'react';
import ReactDOM from 'react-dom';
import DiploMatic from './component/DiploMatic';
import {createReduxStore} from './model/ReduxStore';
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme'

/**
 * Default instantiation
 */
class EditionCrafter {
  /**
   */
  constructor(config) {
    this.config = config;

    if (config.id) {
      this.container = document.getElementById(config.id);
      config.id && ReactDOM.render(
        <ThemeProvider theme={theme}>
          <DiploMatic store={createReduxStore()} />
        </ThemeProvider>,
        this.container
      )
    }
  }

 
  /**
   * Cleanup method to unmount from the dom
   */
  unmount() {
    this.container && ReactDOM.unmountComponentAtNode(this.container);
  }
}

export default EditionCrafter;
