import React from 'react';
import {connect} from 'react-redux';
import {Icon} from "react-font-awesome-5";

import DocumentHelper from '../model/DocumentHelper';

class Pagination extends React.Component {

	constructor(props,context){
		super(props,context);
		this.changeCurrentFolio = this.changeCurrentFolio.bind(this);
	}

	changeCurrentFolio = (event) => {
		if(typeof event.currentTarget.dataset.id === 'undefined' || event.currentTarget.dataset.id.length === 0){
			return;
		}

		let longID = DocumentHelper.folioURL(event.currentTarget.dataset.id);
		this.props.documentViewActions.changeCurrentFolio(
			longID,
			this.props.side,
			this.props.documentView[this.props.side].transcriptionType
		);
	}


    render() {
		const folioName = this.props.document.folioNameByIDIndex[this.props.documentView[this.props.side].iiifShortID];
		return (
			<div className="paginationComponent">
				<div className="paginationControl">

					<span	title = "Go back"
							onClick={this.changeCurrentFolio}
							data-id={this.props.documentView[this.props.side].previousFolioShortID}
							className={(this.props.documentView[this.props.side].hasPrevious)?'arrow':'arrow disabled'}><Icon.ArrowCircleLeft/> </span>

					<span className="folioName">Folio {folioName}</span>

					<span 	title = "Go forward"
							onClick={this.changeCurrentFolio}
							data-id={this.props.documentView[this.props.side].nextFolioShortID}
							className={(this.props.documentView[this.props.side].hasNext)?'arrow':'arrow disabled'}> <Icon.ArrowCircleRight/></span>
				</div>
			</div>
		)
    }
}

function mapStateToProps(state) {
	return {
		document: state.document
    };
}


export default connect(mapStateToProps)(Pagination);
