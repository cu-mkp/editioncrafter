import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { dispatchAction } from '../model/ReduxStore';

class RouteListener extends React.Component {
  constructor(props) {
    super(props);
    this.listening = false;
  }

  componentDidMount() {
    if (!this.listening) {
      this.userNavigated();
      this.props.history.listen((location, action) => {
        this.userNavigated();
      });
      this.listening = true;
    }
  }

  userNavigated() {
    dispatchAction(this.props, 'RouteListenerSaga.userNavigatation', this.props.history.location);
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(withRouter(RouteListener));
