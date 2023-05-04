import React from 'react';
import { connect } from 'react-redux';
import withRouter from '../hocs/withRouter';
import { dispatchAction } from '../model/ReduxStore';

class RouteListener extends React.Component {
  constructor(props) {
    super(props);
    this.listening = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.router.location !== prevProps.router.location) {
      this.userNavigated();
    }
  }

  componentDidMount() {
    if (!this.listening) {
      this.userNavigated();
      this.listening = true;
    }
  }

  userNavigated() {
    dispatchAction(this.props, 'RouteListenerSaga.userNavigatation', this.props.router.location);
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
