import withWidth from '@material-ui/core/withWidth';
import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { connect, Provider } from 'react-redux';
import {
  HashRouter, Route, Navigate, Routes,
} from 'react-router-dom';
import DocumentView from './DocumentView';
import RouteListener from './RouteListener';

const DiploMatic = (props) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState('min(100%, 100dvh');
  const containerRef = useRef(null);
  useEffect(() => {
    const history = createBrowserHistory();
    history.listen(() => {
      window.scrollTo(0, 0);
    });
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      if (containerRef.current.clientHeight === 0) {
        setContainerHeight('100dvh');
      }
    }
  }, [containerRef]);

  const { fixedFrameMode } = props.diplomatic;
  const fixedFrameModeClass = fixedFrameMode ? 'editioncrafter' : 'editioncrafter sticky';

  return (
    <Provider store={props.store}>
      <HashRouter>
        <div id="diplomatic" className={fixedFrameModeClass} ref={containerRef} style={{ height: containerHeight }}>
          <RouteListener />
          <div id="content" style={{ height: '100%' }}>
            <Routes>
              <Route path="/ec/:folioID/:transcriptionType/:folioID2/:transcriptionType2/:folioID3/:transcriptionType3" element={<DocumentView {...props} containerWidth={containerWidth} />} exact />
              <Route path="/ec/:folioID/:transcriptionType/:folioID2/:transcriptionType2" element={<DocumentView {...props} containerWidth={containerWidth} />} exact />
              <Route path="/ec/:folioID/:transcriptionType" element={<DocumentView {...props} containerWidth={containerWidth} />} exact />
              <Route path="/ec/:folioID" element={<DocumentView {...props} containerWidth={containerWidth} />} exact />
              <Route path="/ec" element={<DocumentView {...props} containerWidth={containerWidth} />} exact />
              <Route path="/" element={<Navigate to="/ec" />} exact />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </Provider>
  );
};

DiploMatic.propTypes = {
  store: PropTypes.isRequired,
  config: PropTypes.isRequired,
};

function mapStateToProps(state) {
  return {
    diplomatic: state.diplomatic,
    documentView: state.documentView,
  };
}

export default withWidth()(connect(mapStateToProps)(DiploMatic));
