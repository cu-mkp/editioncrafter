import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Parser from 'html-react-parser';

const EditorComment = (props) => {
  const [anchorRef, setAnchorRef] = useState(null);
  const [open, setOpen] = useState(false);

  const onOpen = (event) => {
    setAnchorRef(event.currentTarget);
    setOpen(true);
  };

  const onClose = (event) => {
    setOpen(false);
  };

  const renderPopper = () => {
    const interpreted = Parser(props.text);
    const content = interpreted || `ERROR: Could not find comment for id: ${props.commentID}.`;
    const style = { maxWidth: 200, padding: '25px 15px 15px 15px' };
    const closeXStyle = { float: 'right', padding: 5, fontStyle: 'bold' };

    return (
      <Popper id={props.commentID} open={open} anchorEl={anchorRef}>
        <Fade in={open}>
          <Paper className="editor-comment-content">
            <div onClick={onClose} style={closeXStyle}>
              <span className="fa fa-window-close" />
            </div>
            <Typography style={style}>{content}</Typography>
          </Paper>
        </Fade>
      </Popper>
    );
  }

  const style = { display: 'inline' };
  const asteriskStyle = { fontStyle: 'bold', fontSize: '18pt', color: 'red' };
  return (
    <div style={style}>
      <span onClick={(e) => onOpen(e)} style={asteriskStyle}>*</span>
      {renderPopper()}
    </div>
  );
}

export default EditorComment;
