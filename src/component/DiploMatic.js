import withWidth from '@material-ui/core/withWidth';
import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import DocumentView from './DocumentView';
import RouteListener from './RouteListener';

class DiploMatic extends Component {
  componentDidMount() {
    const history = createBrowserHistory();
    history.listen(() => {
      window.scrollTo(0, 0);
    });
  }

  renderDocumentView = (props) => {
    const {
      folioID, transcriptionType, folioID2, transcriptionType2,
    } = props.match.params;
    let viewports;

    if (!folioID) {
      // route /folios
      viewports = {
        left: {
          folioID: '-1',
          transcriptionType: 'g',
        },
        right: {
          folioID: '-1',
          transcriptionType: 'tl',
        },
      };
    } else {
      const leftFolioID = folioID;
      let leftTranscriptionType; let rightFolioID; let
        rightTranscriptionType;
      if (folioID2) {
        // route /ec/:folioID/:transcriptionType/:folioID2/:transcriptionType2
        leftTranscriptionType = transcriptionType;
        rightFolioID = folioID2;
        rightTranscriptionType = transcriptionType2 || 'tl';
      } else {
        // route /ec/:folioID
        // route /ec/:folioID/:transcriptionType
        leftTranscriptionType = 'f';
        rightFolioID = folioID;
        rightTranscriptionType = transcriptionType || 'tl';
      }

      viewports = {
        left: {
          folioID: leftFolioID,
          transcriptionType: leftTranscriptionType,
        },
        right: {
          folioID: rightFolioID,
          transcriptionType: rightTranscriptionType,
        },
      };
    }

    return (
      <DocumentView viewports={viewports} history={props.history} />
    );
  };

  renderContent() {
    return (
      <div id="content">
        <Switch>
          <Route path="/ec/:folioID/:transcriptionType/:folioID2/:transcriptionType2" render={this.renderDocumentView} exact />
          <Route path="/ec/:folioID/:transcriptionType" render={this.renderDocumentView} exact />
          <Route path="/ec/:folioID" render={this.renderDocumentView} exact />
          <Route path="/ec" render={this.renderDocumentView} exact />
          <Route path="/" render={() => <Redirect to="/ec" />} exact />
        </Switch>
      </div>
    );
  }

  render() {
    const { fixedFrameMode } = this.props.diplomatic;
    const fixedFrameModeClass = fixedFrameMode ? 'fixed' : 'sticky';

    return (
      <Provider store={this.props.store}>
        <HashRouter>
          <div id="diplomatic" className={fixedFrameModeClass}>
            <RouteListener />
            { this.renderContent() }
          </div>
        </HashRouter>
      </Provider>
    );
  }
}

DiploMatic.propTypes = {
  store: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    diplomatic: state.diplomatic,
    documentView: state.documentView,
  };
}

export default withWidth()(connect(mapStateToProps)(DiploMatic));
