import { Typography } from '@material-ui/core'
import Parser from 'html-react-parser'
import React, { Component } from 'react'
import Markdown from 'react-markdown'
import { connect } from 'react-redux'
import { alpha } from './AlphabetLinks'
import Navigation from './Navigation'

class GlossaryView extends Component {
  constructor() {
    super()
    this.state = { filterTerm: '' }
  }

  renderGlossary() {
    const { glossary } = this.props.glossary
    const filterTerm = this.state.filterTerm.toLowerCase()
    const entryList = Object.values(glossary.entries)

    const checkHeadwords = (headword, term, delimiter) => {
      const words = headword.split(delimiter)
      for (const word of words) {
        if (word.startsWith(term))
          return true
      }
      return false
    }

    // {head-word}, {alternate-spelling}: {meaning-number}. {part-of-speech} {meaning} [{references}]
    const glossaryEntries = []
    let alphaIndex = 0

    for (const entry of entryList) {
      // render alphabetic header if we have started the next letter
      if (filterTerm.length === 0 && entry.headWord[0] === alpha[alphaIndex]) {
        const alphaHeadingID = `alpha-${alphaIndex}`
        glossaryEntries.push(
          <Typography variant="h4" key={`gloss-heading-${alpha[alphaIndex]}`} id={alphaHeadingID}>
            &mdash;
            {alpha[alphaIndex]}
            {' '}
            &mdash;
          </Typography>,
        )
        alphaIndex++
      }
      const lowerCaseHeadword = entry.headWord.toLowerCase()

      const lowerCaseAltSpellings = entry.alternateSpellings.toLowerCase()
      const lowerCaseModSpellings = entry.modernSpelling.toLowerCase()
      if (filterTerm.length === 0
        || (filterTerm.length !== 0 && checkHeadwords(lowerCaseHeadword, filterTerm, ' '))
        || (filterTerm.length !== 0 && checkHeadwords(lowerCaseModSpellings, filterTerm, ' '))
        || (filterTerm.length !== 0 && checkHeadwords(lowerCaseAltSpellings, filterTerm, ', '))
      ) {
        const meanings = renderMeanings(entry)
        const meaningsEndWithPeriod = meanings[meanings.length - 1].endsWith('.')
        const altString = entry.alternateSpellings ? `, ${entry.alternateSpellings}` : ''
        const pos = entry.meanings[0].partOfSpeech
        const partOfSpeech = pos ? `${pos}:` : ''
        const modPunctuation = pos ? ',' : ':'
        const modString = entry.modernSpelling ? ` (mod. ${entry.modernSpelling})` : ''
        const comma = meaningsEndWithPeriod ? '' : ','
        const seeAlso = entry.seeAlso ? `${comma} see also <span>&#8594;</span>${entry.seeAlso} ` : ''
        const synonym = entry.synonym ? `, syn. <span>&#8594;</span>${entry.synonym}` : ''
        const antonym = entry.antonym ? `, ant. <span>&#8594;</span>${entry.antonym}` : ''
        glossaryEntries.push(
          <Typography gutterBottom key={`gloss-${entry.headWord}`}>
            <u>{entry.headWord}</u>
            {altString}
            {modString}
            {modPunctuation}
            {' '}
            {partOfSpeech}
            {' '}
            {
              meanings.map(meaningful => Parser(meaningful))
            }
            {Parser(seeAlso)}
            {Parser(synonym)}
            {Parser(antonym)}
          </Typography>,
        )
      }
    }

    return glossaryEntries
  }

  onFilterChange = (event) => {
    const filterTerm = event.target.value
    this.setState({ ...this.state, filterTerm })
  }

  render() {
    if (!this.props.glossary.loaded)
      return null

    return (
      <div id="glossaryView" style={{ position: 'relative', overflow: 'auto' }}>
        <Navigation
          side={this.props.side}
          onFilterChange={this.onFilterChange}
          value={this.state.filterTerm}
          documentView={this.props.documentView}
          documentViewActions={this.props.documentViewActions}
        />

        <div id="glossaryViewInner">
          <div id="glossaryContent">
            <Typography variant="h2" className="title">Glossary</Typography>
            {
              this.props.glossary.glossary.title
              && (
                <div className="subtitle MuiTypography-root MuiTypography-body1">
                  <Markdown>
                    { this.props.glossary.glossary.title }
                  </Markdown>
                </div>
              )
            }
            <div className="cite-instructions">
              {
                this.props.glossary.glossary.citation
                && (
                  <>
                    <Typography className="cite-header">How to Cite</Typography>
                    <div className="MuiTypography-root MuiTypography-body1">
                      <Markdown>
                        { this.props.glossary.glossary.citation }
                      </Markdown>
                    </div>
                  </>
                )
              }
            </div>
            { this.renderGlossary() }
          </div>
        </div>

      </div>
    )
  }
}

function renderMeanings(entry) {
  const meaningList = []
  for (let i = 0; i < entry.meanings.length; i++) {
    const meaning = entry.meanings[i]

    const refString = meaning.references ? ` [${meaning.references}]` : ''
    const numString = (entry.meanings.length > 1) ? `${i + 1}. ` : ''
    const space = i < entry.meanings.length - 1 ? ' ' : ''
    meaningList.push(
      `${numString}${meaning.meaning}${refString}${space}`,
    )
  }
  return meaningList
}

function mapStateToProps(state) {
  return {
    glossary: state.glossary,
  }
}

export default connect(mapStateToProps)(GlossaryView)
