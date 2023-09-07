/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router';
import { dispatchAction } from '../model/ReduxStore';

const RouteListener = (props) => {
  const listening = useRef(false);

  const location = useLocation();

  const userNavigated = () => {
    dispatchAction(props, 'RouteListenerSaga.userNavigatation', location);
  };

  useEffect(() => {
    if (!listening.current) {
      userNavigated();
      listening.current = true;
    }
  }, []);

  useEffect(() => {
    userNavigated();
  }, [location]);

  return null;
};

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(RouteListener);
