import { Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { connect } from 'react-redux'
import Navigation from './Navigation'
import { useNavigate } from 'react-router'


function NotesView(props) {
  const [filterTerm, setFilterTerm] = useState('')
  const navigate = useNavigate();

 useEffect(() => {
    //convert links to use EC navigation
    const notesPanel = window.document.querySelector('#notesView');
    if (notesPanel) {
      const allLinks = notesPanel.querySelectorAll('a');
      for (let i = 0; i < allLinks.length; i++) {
        const link = allLinks[i];
        if (link.getAttribute('href')) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(link.getAttribute('href'));
          })
        }
      }
    }
  }, [props.notes]);

  const onFilterChange = (event) => {
    setFilterTerm(event.target.value);
  }


    return (
      props.notes.loaded && <div id="notesView" style={{ position: 'relative', overflow: 'auto' }}>
        <Navigation
          side={props.side}
          onFilterChange={onFilterChange}
          value={filterTerm}
          documentView={props.documentView}
          documentViewActions={props.documentViewActions}
        />

        <div id="notesViewInner">
          <div id="notesContent">
            <ReactMarkdown children={props.notes.notes} remarkPlugins={[remarkGfm]}/>
          </div>
        </div>

      </div>
    )
  }


function mapStateToProps(state) {
  return {
    notes: state.notes,
  }
}

export default connect(mapStateToProps)(NotesView)
