import React, { Component } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import DiploMatic from './component/DiploMatic';
import { createReduxStore } from './model/ReduxStore';
import theme from './theme';

/**
 * Default instantiation
 */
class EditionCrafter extends Component {
  componentDidMount() {
    console.log('hello');
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <DiploMatic config={this.props.config} store={createReduxStore(this.props.config)} />
      </ThemeProvider>
    );
  }
}

export default EditionCrafter;
