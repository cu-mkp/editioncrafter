import React from 'react';
import ReactDOM from 'react-dom';
import EditionCrafterComponent from '@cu-mkp/editioncrafter';

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
        <EditionCrafterComponent 
          config={config} //not needed once react component is updated to have destructured props
          {...config}  
        />,
        this.container,
      );
    }
    // note: once the EC react component is updated, 
  }

  /**
   * Cleanup method to unmount from the dom
   */
  unmount() {
    this.container && ReactDOM.unmountComponentAtNode(this.container);
  }
}

export default EditionCrafter;
