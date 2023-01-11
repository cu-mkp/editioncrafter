import React from 'react';
import ReactDOM from 'react-dom';

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
        this.render(),
        this.container,
      );
    }
  }

  /**
   * Render the viewer
   */
  render(props = {}) {
    return (
      <div>
        <p>Hello from EditionCrafter!</p>
      </div>
    );
  }

  /**
   * Cleanup method to unmount from the dom
   */
  unmount() {
    this.container && ReactDOM.unmountComponentAtNode(this.container);
  }
}

export default EditionCrafter;
