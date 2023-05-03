import React from 'react';
import { connect } from 'react-redux';
import {
  FaArrowCircleLeft,
  FaArrowCircleRight,
} from 'react-icons';

class Pagination extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.changeCurrentFolio = this.changeCurrentFolio.bind(this);
  }

  changeCurrentFolio = (event) => {
    const {
      side, documentView, documentViewActions,
    } = this.props;
    const { dataset } = event.currentTarget;

    if (typeof dataset.id === 'undefined' || dataset.id.length === 0) {
      return;
    }

    const folioID = dataset.id;
    documentViewActions.changeCurrentFolio(
      folioID,
      side,
      documentView[side].transcriptionType,
    );
  };

  render() {
    const { side, document, documentView } = this.props;
    if( documentView[side].iiifShortID === '-1' ) return null;
    const folioName = document.folioIndex[documentView[side].iiifShortID].name;
    return (
      <div className="paginationComponent">
        <div className="paginationControl">

          <span
            title="Go back"
            onClick={this.changeCurrentFolio}
            data-id={documentView[side].previousFolioShortID}
            className={(documentView[side].hasPrevious) ? 'arrow' : 'arrow disabled'}
          >
            <FaArrowCircleLeft />
          </span>

          <span className="folioName">
            {folioName}
          </span>

          <span
            title="Go forward"
            onClick={this.changeCurrentFolio}
            data-id={documentView[side].nextFolioShortID}
            className={(documentView[side].hasNext) ? 'arrow' : 'arrow disabled'}
          >
            {' '}
            <FaArrowCircleRight />
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    document: state.document,
  };
}

export default connect(mapStateToProps)(Pagination);
