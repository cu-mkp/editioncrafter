import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Typography } from '@material-ui/core';
import Parser from 'html-react-parser';
import Navigation from './Navigation'
import {alpha} from './AlphabetLinks'

class GlossaryView extends Component {

    constructor() {
        super()
        this.state = { filterTerm: '' }
    }

	changeType = (event) => {
		// Change viewtype
		this.props.documentViewActions.changeTranscriptionType(
			this.props.side,
			event.currentTarget.dataset.id
		);
    }

    renderMeanings(entry) {
        const meaningList = []
        for( let i=0; i < entry.meanings.length; i++ ) { 
            const meaning = entry.meanings[i];
           
            const refString = meaning.references ? ` [${meaning.references}]` : ''
            const numString = (entry.meanings.length > 1) ? `${i+1}. ` : ''
            const space = i < entry.meanings.length - 1 ? ' ' : ''
            meaningList.push( 
                `${numString}${meaning.meaning}${refString}${space}`
            )
        }
        return meaningList
    }

    renderGlossary() {
        const {glossary} = this.props.glossary
        const filterTerm = this.state.filterTerm.toLowerCase()
        const entryList = Object.values(glossary)

        const checkHeadwords = (headword,term, delimiter) => { 
            const words = headword.split(delimiter)
            for( const word of words ) {
                if( word.startsWith(term) ) return true
            }
            return false
        }

        // {head-word}, {alternate-spelling}: {meaning-number}. {part-of-speech} {meaning} [{references}]        
        const glossaryEntries = []
        let alphaIndex = 0
        
        for( let entry of entryList ) {
            // render alphabetic header if we have started the next letter
            if( filterTerm.length === 0 && entry.headWord[0] === alpha[alphaIndex] ) {
                const alphaHeadingID = `alpha-${alphaIndex}` 
                glossaryEntries.push(
                    <Typography variant='h4' key={`gloss-heading-${alpha[alphaIndex]}`} id={alphaHeadingID}>&mdash; {alpha[alphaIndex]} &mdash;</Typography>
                )
                alphaIndex++
            }
            const lowerCaseHeadword = entry.headWord.toLowerCase()

            const lowerCaseAltSpellings = entry.alternateSpellings.toLowerCase()
            const lowerCaseModSpellings = entry.modernSpelling.toLowerCase()
            if( filterTerm.length === 0 ||
                (filterTerm.length !== 0 && checkHeadwords(lowerCaseHeadword, filterTerm, ' ')) ||
                (filterTerm.length !== 0 && checkHeadwords(lowerCaseModSpellings,filterTerm, ' ')) ||
                (filterTerm.length !== 0 && checkHeadwords(lowerCaseAltSpellings, filterTerm, ', '))
            ) {
                const meanings = this.renderMeanings(entry)
                const meaningsEndWithPeriod = meanings[ meanings.length-1 ].endsWith('.')
                const altString = entry.alternateSpellings? `, ${entry.alternateSpellings}` : '';
                const pos = entry.meanings[0].partOfSpeech
                const partOfSpeech = pos ? `${pos}:` : '';
                const modPunctuation = pos ? ',' : ':';
                const modString = entry.modernSpelling? ` (mod. ${entry.modernSpelling})` :'';
                const comma = meaningsEndWithPeriod ? '' : ','
                const seeAlso = entry.seeAlso? `${comma} see also <span>&#8594;</span>${entry.seeAlso} `:'';
                const synonym = entry.synonym? `, syn. <span>&#8594;</span>${entry.synonym}`:'';
                const antonym = entry.antonym? `, ant. <span>&#8594;</span>${entry.antonym}`:'';
                glossaryEntries.push( 
                    <Typography gutterBottom key={`gloss-${entry.headWord}`} ><u>{entry.headWord}</u>{altString}{modString}{modPunctuation} {partOfSpeech} {
                          meanings.map(meaningful=>{
                                return Parser(meaningful)
                          })}{Parser(seeAlso)}{Parser(synonym)}{Parser(antonym)}</Typography>
                )    
            }
        }

        return glossaryEntries
    }

    onFilterChange = (event) => {
        const filterTerm = event.target.value;
		this.setState( { ...this.state, filterTerm })
    }

	render() {
        if( !this.props.glossary.loaded ) return null;

        return (
            <div id="glossaryView">
                  <Navigation 
                        side={this.props.side} 
                        onFilterChange = {this.onFilterChange}
                        value = {this.state.filterTerm}
                        documentView={this.props.documentView} 
                        documentViewActions={this.props.documentViewActions}/>
              
                  <div id="glossaryViewInner">
                        <div id="glossaryContent">
                              <Typography variant='h2' className="title">Glossary</Typography>
                              <Typography className="subtitle">For short titles, e.g., [COT1611], see <a href="#/content/resources/bibliography">Bibliography</a>.</Typography>
                              <div className="cite-instructions">
                                <Typography className='cite-header'>How to Cite</Typography>
                                <Typography>“Glossary.” In <i>Secrets of Craft and Nature in Renaissance France. A Digital Critical Edition and English Translation of BnF Ms. Fr. 640</i>, edited by Making and Knowing Project, Pamela H. Smith, Naomi Rosenkranz, Tianna Helena Uchacz, Tillmann Taape, Clément Godbarge, Sophie Pitman, Jenny Boulboullé, Joel Klein, Donna Bilak, Marc Smith, and Terry Catapano. New York: Making and Knowing Project, 2020. <a href="https://edition640.makingandknowing.org/#/folios/1r/f/1r/glossary">https://edition640.makingandknowing.org/#/folios/1r/f/1r/glossary</a>.</Typography>
                              </div>
                              { this.renderGlossary() }
                        </div>
                  </div>

            </div>
        );

	}
}


function mapStateToProps(state) {
	return {
		glossary: state.glossary
    };
}

export default connect(mapStateToProps)(GlossaryView);
