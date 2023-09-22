import withWidth from '@material-ui/core/withWidth';
import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect, Provider } from 'react-redux';
import {
  HashRouter, Route, Navigate, Routes,
} from 'react-router-dom';
import DocumentView from './DocumentView';
import RouteListener from './RouteListener';

const DiploMatic = (props) => {
  useEffect(() => {
    const history = createBrowserHistory();
    history.listen(() => {
      window.scrollTo(0, 0);
    });
  });

  const { fixedFrameMode } = props.diplomatic;
  const fixedFrameModeClass = fixedFrameMode ? 'fixed' : 'sticky';

  return (
    <Provider store={props.store}>
      <HashRouter>
        <div id="diplomatic" className={fixedFrameModeClass}>
          <RouteListener />
          <div id="content">
            <Routes>
              <Route path="/ec/:folioID/:transcriptionType/:folioID2/:transcriptionType2" element={<DocumentView {...props} />} exact />
              <Route path="/ec/:folioID/:transcriptionType" element={<DocumentView {...props} />} exact />
              <Route path="/ec/:folioID" element={<DocumentView {...props} />} exact />
              <Route path="/ec" element={<DocumentView {...props} />} exact />
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
