import React, { useMemo, useState } from 'react';
import { BigRingSpinner } from './RingSpinner';

const SeaDragonComponent = (props) => {
  const { side, initViewer, tileSource } = props;
  const [loading, setLoading] = useState(true);

  const viewer = useMemo(() => (
    <div id={`image-view-seadragon-${side}`} ref={(el) => { initViewer(el, tileSource).then(() => {setLoading(false);}) }}>
      { loading && <BigRingSpinner color="light" />}
    </div>
  ), [loading]);

  return viewer;
};

export default SeaDragonComponent;
