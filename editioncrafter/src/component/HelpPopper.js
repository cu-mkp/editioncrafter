import React from 'react';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {
  FaArrowCircleLeft,
  FaArrowCircleRight,
} from 'react-icons/fa';
import asterisk from '../icons/howtouse-asterisk.png';
import curly from '../icons/howtouse-curly.png';
import beaker from '../icons/howtouse-beaker.png';
import square from '../icons/howtouse-square.png';
import ups from '../icons/howtouse-ups.png';

const HelpPopper = (props) => (
  <Popper anchorEl={props.anchorEl} open={props.open} style={props.marginStyle}>
    <Fade in={props.open}>
      <Paper className="helpContainer">
        <div onClick={props.onClose} className="closeX">
          <span className="fa fa-window-close" />
        </div>
        <div>
          <Typography variant="h6" component="h2">Toolbar Buttons</Typography>
          <List>
            <ListItem>
              <span className="fa fa-lock" />
              <ListItemText primary="Toggle Sync Views" />
            </ListItem>
            <ListItem>
              <span className="fa fa-book" />
              <ListItemText primary="Toggle Book Mode" />
            </ListItem>
            <ListItem>
              <span className="fa fa-code" />
              <ListItemText primary="Toggle XML Mode" />
            </ListItem>
            <ListItem>
              <span className="horizontal-buttons">
                <FaArrowCircleLeft />
                <FaArrowCircleRight />
              </span>
              <ListItemText primary="Go Forward / Back" />
            </ListItem>
            <ListItem>
              <span className="fa fa-hand-point-right" />
              <ListItemText primary="Jump to folio" />
            </ListItem>
            <div className="readingGuide">
              <Typography variant="h6" component="h2">Reading Guide</Typography>
              <table>
                <thead>
                  <tr>
                    <th><Typography variant="overline" component="span">Syntax</Typography></th>
                    <th><Typography variant="overline" component="span">Meaning</Typography></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><img src={ups} alt="howtouse-ups" /></td>
                    <td><Typography>Text is under the paper strip</Typography></td>
                  </tr>
                  <tr>
                    <td><img src={curly} alt="howtouse-curly" /></td>
                    <td><Typography>Expanded version implied by abbreviation marks</Typography></td>
                  </tr>
                  <tr>
                    <td><img src={square} alt="howtouse-square" /></td>
                    <td><Typography>Editorial interventions and corrections</Typography></td>
                  </tr>
                  <tr>
                    <td><img src={beaker} alt="howtouse-beaker" /></td>
                    <td><Typography>Associated research essay</Typography></td>
                  </tr>
                  <tr>
                    <td><img src={asterisk} alt="howtouse-asterisk" /></td>
                    <td><Typography>Editorial Comments</Typography></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </List>
          <Typography>
            See
            &nbsp;
            <a href="#/content/how-to-use">How to Use</a>
            &nbsp;
            for more information.
          </Typography>
        </div>
      </Paper>
    </Fade>
  </Popper>
);

export default HelpPopper;
