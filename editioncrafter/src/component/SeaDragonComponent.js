import React, { useMemo } from 'react';

const SeaDragonComponent = (props) => {
  const { side, initViewer, tileSource } = props;

  const viewer = useMemo(() => (
    <div id={`image-view-seadragon-${side}`} ref={(el) => { initViewer(el, tileSource); }} />
  ), []);

  return viewer;
};

export default SeaDragonComponent;
