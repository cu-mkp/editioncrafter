import { Typography } from '@material-ui/core'
import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { connect } from 'react-redux'
import Navigation from './Navigation'

class NotesView extends Component {
    constructor() {
        super()
        this.state = { filterTerm: '' }
    }

    onFilterChange = (event) => {
        const filterTerm = event.target.value
        this.setState({ ...this.state, filterTerm })
    }
    
  render() {
    if (!this.props.notes.loaded)
      return null

    return (
      <div id="notesView" style={{ position: 'relative', overflow: 'auto' }}>
        <Navigation
          side={this.props.side}
          onFilterChange={this.onFilterChange}
          value={this.state.filterTerm}
          documentView={this.props.documentView}
          documentViewActions={this.props.documentViewActions}
        />

        <div id="notesViewInner">
          <div id="notesContent">
            <ReactMarkdown children={this.props.notes.notes} remarkPlugins={[remarkGfm]}/>
          </div>
        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    notes: state.notes,
  }
}

export default connect(mapStateToProps)(NotesView)
