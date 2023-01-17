import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import DocumentView from './DocumentView';
import RouteListener from './RouteListener';

class DiploMatic extends Component {

	constructor(props) {
		super(props);
		this.state = { 
			searchOpen: false,
			mobileMenuOpen: false,
			searchHelpAnchor: null,
		};
	}

	componentWillMount() {
		const history = createBrowserHistory()
		history.listen(() => {
			window.scrollTo(0, 0);
		})	
    }

	renderDocumentView = (props) => {
		const { folioID, transcriptionType, folioID2, transcriptionType2 } = props.match.params;
		let viewports;

		if( !folioID ) {
			// route /folios
			viewports = {
				left: {
					folioID: '-1',
					transcriptionType: 'g'
				},
				right: {
					folioID: (isWidthUp('md', this.props.width)) ? '-1' : '1r',
					transcriptionType: 'tc'
				}
			}
		} else {
			let leftFolioID = folioID;
			let leftTranscriptionType, rightFolioID, rightTranscriptionType;
			if( folioID2 ) {
				// route /folios/:folioID/:transcriptionType/:folioID2/:transcriptionType2
				leftTranscriptionType = transcriptionType;
				rightFolioID = folioID2;
				rightTranscriptionType = transcriptionType2 ? transcriptionType2 : 'tc'
			} else {
				// route /folios/:folioID
				// route /folios/:folioID/:transcriptionType
				leftTranscriptionType = 'f';
				rightFolioID = folioID;
				rightTranscriptionType = transcriptionType ? transcriptionType : 'tc';
			}

			viewports = {
				left: {
					folioID: leftFolioID,
					transcriptionType: leftTranscriptionType
				},
				right: {
					folioID: rightFolioID,
					transcriptionType: rightTranscriptionType
				}	
			}	
		}
	
		return (
			<DocumentView viewports={viewports} history={props.history}></DocumentView>
		);
	}

	renderContent() {
		return (
			<div id="content">
				<Switch>
					<Route path="/folios/:folioID/:transcriptionType/:folioID2/:transcriptionType2" render={this.renderDocumentView} exact/>
					<Route path="/folios/:folioID/:transcriptionType" render={this.renderDocumentView} exact/>
					<Route path="/folios/:folioID" render={this.renderDocumentView} exact/>
					<Route path="/folios" render={this.renderDocumentView} exact/>
				</Switch>
			</div>
		);
	}

	render() {
		const { fixedFrameMode } = this.props.diplomatic
		const fixedFrameModeClass = fixedFrameMode ? 'fixed' : 'sticky';

		return (
			<Provider store={this.props.store}>
				<HashRouter>
					<div id="diplomatic" className={fixedFrameModeClass}>
						<RouteListener/>
						{ this.renderContent() }
					</div>	
				</HashRouter>
			</Provider>
		);
	}
}

DiploMatic.propTypes = {
	store: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return {
		diplomatic: state.diplomatic,
		documentView: state.documentView
	};
}

export default withWidth() (connect(mapStateToProps)(DiploMatic));
