import React, { Component } from 'react'
import { Link } from 'react-scroll'

export const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'Z']

export default class AlphabetLinks extends Component {
  renderAlphaLinks() {
    const letterLinks = []
    for (let i = 0; i < alpha.length; i++) {
      const letter = alpha[i]
      const alphaID = `alpha-${i}`
      letterLinks.push(
        <span key={`link-${alphaID}`}>
          <Link to={alphaID} offset={-120} containerId="glossaryViewInner" smooth="true">{letter}</Link>
          {' '}
        </span>,
      )
    }

    return (
      <div style={{ display: 'inline' }}>
        <input
          id="glossary-filter"
          className="searchBox"
          placeholder="Filter by Entry"
          onChange={this.props.onFilterChange}
          value={this.props.filterTerm}
        />

        <div className="alphaNav">
          <span style={{ color: 'black' }}>Go to: </span>
          { letterLinks }
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="glossaryNav">
        { this.renderAlphaLinks() }
      </div>
    )
  }
}
