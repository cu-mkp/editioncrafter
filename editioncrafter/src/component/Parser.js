import HtmlReactParser from 'html-react-parser'
import React from 'react'

// This component addresses a conflict between React and
// documents whose elements contain `ref` attributes.
// Because we're parsing transcription contents as React
// elements, migrating TranscriptionView to a function
// component caused React to error about the ref attributes.

// The short-term fix is to wrap this simple class component
// around the parser.

class Parser extends React.Component {
  render() {
    const { html, htmlToReactParserOptionsSide } = this.props

    return HtmlReactParser(html, htmlToReactParserOptionsSide)
  }
}

export default Parser
