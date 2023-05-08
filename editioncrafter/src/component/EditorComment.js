import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Parser from 'html-react-parser';

class EditorComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorRef: null,
      open: false,
    };
  }

  onOpen = event => {
    this.setState({ anchorRef: event.currentTarget, open: true });
  };

  onClose = event => {
    this.setState({ ...this.state, open: false });
  };

  renderPopper() {
    const { anchorRef, open } = this.state;
    const id = `comment-${this.props.commentID}`;
    const { comments } = this.props.comments;
    const comment = comments[this.props.commentID] ? comments[this.props.commentID].comment : null;
    let interpreted;
    if (comment) interpreted = Parser(comment);
    const content = interpreted || (comment || `ERROR: Could not find comment for id: ${this.props.commentID}.`);
    const style = { maxWidth: 200, padding: '25px 15px 15px 15px' };
    const closeXStyle = { float: 'right', padding: 5, fontStyle: 'bold' };
    return (
      <Popper id={id} open={open} anchorEl={anchorRef}>
        <Fade in={open}>
          <Paper className="editor-comment-content">
            <div onClick={this.onClose} style={closeXStyle}>
              <span className="fa fa-window-close" />
            </div>
            <Typography style={style}>{content}</Typography>
          </Paper>
        </Fade>
      </Popper>
    );
  }

  render() {
    const style = { display: 'inline' };
    const asteriskStyle = { fontStyle: 'bold', fontSize: '18pt', color: 'red' };
    return (
      <div style={style}>
        <span onClick={(e) => this.onOpen(e)} style={asteriskStyle}>*</span>
        {this.renderPopper()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    comments: state.comments,
  };
}

export default connect(mapStateToProps)(EditorComment);
