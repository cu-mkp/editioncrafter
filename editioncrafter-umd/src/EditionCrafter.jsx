import React from 'react';
import ReactDOM from 'react-dom';
import EditionCrafterComponent from '../../editioncrafter/dist/es/src/index';

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
        <EditionCrafterComponent config={config} />,
        this.container,
      );
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
