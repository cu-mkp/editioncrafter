import React, {Component} from 'react';
import {connect} from 'react-redux';
import SplitPaneView from './SplitPaneView';
import {dispatchAction} from '../model/ReduxStore';
import ImageView from './ImageView';
import ImageGridView from './ImageGridView';
import TranscriptionView from './TranscriptionView';
import XMLView from './XMLView';
import GlossaryView from './GlossaryView';
import DocumentHelper from '../model/DocumentHelper';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import SinglePaneView from './SinglePaneView';


class DocumentView extends Component {

    constructor(props) {
        super(props)

        const paneDefaults = {
            isXMLMode: false,
            isGridMode: true,
            width: 0
        }

        this.state = {
            linkedMode: true,
            bookMode: false,
            inSearchMode:false,
            left: {
                ...paneDefaults
            },
            right: {
                ...paneDefaults
            }
        }

        this.documentViewActions = {
            setXMLMode: this.setXMLMode.bind(this),
            setLinkedMode: this.setLinkedMode.bind(this),
            setBookMode: this.setBookMode.bind(this),
            setGridMode: this.setGridMode.bind(this),
            changeTranscriptionType: this.changeTranscriptionType.bind(this),
            changeCurrentFolio: this.changeCurrentFolio.bind(this),
            jumpToFolio: this.jumpToFolio.bind(this),
        }
    }

    componentWillMount() {
        dispatchAction( this.props, 'DiplomaticActions.setFixedFrameMode', true );
    }

    setXMLMode( side, xmlMode ) {
        this.setState((state) => {
            let nextState = { ...state };
            nextState[side].isXMLMode = xmlMode
            return nextState;
        });
    }
    
    setLinkedMode( linkedMode ) {
        this.setState((state) => {
            return Object.assign({}, state, {
                linkedMode: linkedMode
            })
        });
    }
    
    setBookMode( shortid, bookMode ) {
        this.setState((state) => {
            return Object.assign({}, state, {
                bookMode
            })
        });

        if( bookMode ) {
            let [ versoID, rectoID ] = this.findBookFolios(shortid);
            let versoName = this.props.document.folioNameByIDIndex[versoID];
            let rectoName = this.props.document.folioNameByIDIndex[rectoID];
            this.navigateFolios( versoName, 'f', rectoName, 'f' );
        }
    }

    jumpToFolio( folioName, side ) {
        // Convert folioName to ID (and confirm it exists)
        const validFolioName = DocumentHelper.validFolioName(folioName)
        if( validFolioName ) {
            let folioID = this.props.document.folioIDByNameIndex[validFolioName];
            if(typeof folioID !== 'undefined'){
                let longID = DocumentHelper.folioURL(folioID);
                this.changeCurrentFolio(longID,side,this.props.viewports[side].transcriptionType);
            }    
        }
    }

    findBookFolios(shortID){
        const doc = this.props.document;

        let versoFolio = doc.folioNameByIDIndex[shortID];
        let versoIndex = doc.folioIndex.indexOf(shortID);
        
        if( !versoFolio.endsWith('v') ) {
            if( versoFolio.endsWith('r') ) {
                versoIndex = versoIndex-1;
            } else {
                return [null,null];
            }    
        }

        let rectoIndex = versoIndex + 1;
        return [ doc.folioIndex[versoIndex], doc.folioIndex[rectoIndex] ];
    }

    onWidth = ( left, right ) => {
        this.setState((state) => {
            let nextState = {...state};
            nextState['left'].width = left;
            nextState['right'].width = right;
            return nextState;
        });
    }

    setGridMode( side, newState ) {
        this.setState((state) => {
            let nextState = {...state};
            nextState[side].isGridMode = newState;
            return nextState;
        });
    }

    changeTranscriptionType( side, transcriptionType ) {
        if( side === 'left' ) {
            let folioID = this.props.viewports['left'].folioID;
            let otherSide = this.props.viewports['right'];
            this.navigateFolios(
                folioID,
                transcriptionType,
                otherSide.folioID,
                otherSide.transcriptionType
            );
        } else {
            let folioID = this.props.viewports['right'].folioID;
            let otherSide = this.props.viewports['left'];
            this.navigateFolios(
                otherSide.folioID,
                otherSide.transcriptionType,
                folioID,
                transcriptionType,
            );
        }
    }

    navigateFolios( folioID, transcriptionType, folioID2, transcriptionType2 ) {

        if( !folioID ) {
            // goto grid view
    		this.props.history.push('/folios');
            return;
        }
        if( !transcriptionType ) {
            // goto folioID, tc
    		this.props.history.push(`/folios/${folioID}`);
            return;
        }
        if( !folioID2 ) {
            // goto folioID, transcriptionType
    		this.props.history.push(`/folios/${folioID}/${transcriptionType}`);
            return;
        }
        if( !transcriptionType2 ) {
            // goto folioID, transcriptionType, folioID2, tc
    		this.props.history.push(`/folios/${folioID}/${transcriptionType}/${folioID2}/tc`);
            return;
        }
        // goto folioID, transcriptionType, folioID2, transcriptionType2        
        this.props.history.push(`/folios/${folioID}/${transcriptionType}/${folioID2}/${transcriptionType2}`);
    }

    changeCurrentFolio( id, side, transcriptionType ) {
        // Lookup prev/next
        let iiifShortID = id.substr(id.lastIndexOf('/') + 1);
        let folioID = this.props.document.folioNameByIDIndex[iiifShortID];

        if( this.state.bookMode ) {
            let [ versoID, rectoID ] = this.findBookFolios(iiifShortID);
            if( versoID ) {
                let versoName = this.props.document.folioNameByIDIndex[versoID];
                let rectoName = this.props.document.folioNameByIDIndex[rectoID];
                this.navigateFolios( versoName, 'f', rectoName, 'f' );    
            }
        } else if( this.state.linkedMode ) {
            if( side === 'left' ) {
                let otherSide = this.props.viewports['right'];
                this.navigateFolios( 
                    folioID, 
                    transcriptionType, 
                    folioID,  
                    otherSide.transcriptionType
                );   
            } else {
                let otherSide = this.props.viewports['left'];
                this.navigateFolios( 
                    folioID,  
                    otherSide.transcriptionType,
                    folioID, 
                    transcriptionType 
                );  
            }
        } else {
            if( side === 'left' ) {
                let otherSide = this.props.viewports['right'];
                this.navigateFolios( 
                    folioID, 
                    transcriptionType, 
                    otherSide.folioID,  
                    otherSide.transcriptionType
                );    
            } else {
                let otherSide = this.props.viewports['left'];
                this.navigateFolios( 
                    otherSide.folioID,  
                    otherSide.transcriptionType,
                    folioID, 
                    transcriptionType 
                );    
            }
        }
    }

    determineViewType(side) {
        const transcriptionType = this.props.viewports[side].transcriptionType;
        const xmlMode = this.state[side].isXMLMode;

        if(transcriptionType === 'g' ) {
            return 'ImageGridView';
        }
        if( transcriptionType === 'f' ) {
            return 'ImageView';
        } 
        if( transcriptionType === 'glossary' ) {
            return 'GlossaryView';
        }
        return xmlMode ? 'XMLView' : 'TranscriptionView';
    }

    viewportState(side) {
        const doc = this.props.document;
        const viewport = this.props.viewports[side];

        // blank folio ID
        if( viewport.folioID === '-1' ) {
            return { 
                ...this.state[side],
                iiifShortID: viewport.folioID,
                transcriptionType: viewport.transcriptionType
            }
        }

        const shortID = doc.folioIDByNameIndex[viewport.folioID];
        let nextID = '';
        let prevID = '';
        let current_hasPrev = false;
        let current_hasNext = false;

        if( this.state.bookMode ) {
            let [ versoID ] = this.findBookFolios(shortID);
            let current_idx = doc.folioIndex.indexOf(versoID);
            if (current_idx > -1) {
                current_hasNext = (current_idx < (doc.folioIndex.length - 2));
                nextID = current_hasNext ? doc.folioIndex[current_idx + 2] : '';
                current_hasPrev = (current_idx > 1 && doc.folioIndex.length > 1);
                prevID = current_hasPrev ? doc.folioIndex[current_idx - 2] : '';
            }
        } else {
            let current_idx = doc.folioIndex.indexOf(shortID);
            if (current_idx > -1) {
                current_hasNext = (current_idx < (doc.folioIndex.length - 1));
                nextID = current_hasNext ? doc.folioIndex[current_idx + 1] : '';
        
                current_hasPrev = (current_idx > 0 && doc.folioIndex.length > 1);
                prevID = current_hasPrev ? doc.folioIndex[current_idx - 1] : '';
            }
        }

        return {
            ...this.state[side],
            iiifShortID: shortID,
            transcriptionType: viewport.transcriptionType,
            hasPrevious: current_hasPrev,
            hasNext: current_hasNext,
            previousFolioShortID: prevID,
            nextFolioShortID: nextID
        };
    }

    renderPane(side,docView) {
        const viewType = this.determineViewType(side);
        const key = this.viewPaneKey(side);

        if( viewType === 'ImageView') {
            return (
                <ImageView
                    key={key}
                    documentView={docView}
                    documentViewActions={this.documentViewActions}
                    side={side}
                />
            );
        } else if( viewType === 'TranscriptionView' ) {
            return(
                <TranscriptionView
                    key={key}
                    documentView={docView}
                    documentViewActions={this.documentViewActions}
                    side={side}
                />
            );
        } else if( viewType === 'XMLView' ) {
            return(
                <XMLView
                    key={key}
                    documentView={docView}
                    documentViewActions={this.documentViewActions}
                    side={side}
                />
            );
        } else if( viewType === 'ImageGridView' ) {
            return (
                <ImageGridView
                    key = {key}
                    documentView={docView}
                    documentViewActions={this.documentViewActions}
                    side={side}
                />
            );
        } else if( viewType === 'GlossaryView') {
            return (
                <GlossaryView
                    key = {key}
                    documentView={docView}
                    documentViewActions={this.documentViewActions}
                    side={side}
                />
            );
        } else {
            return (
                <div>ERROR: Unrecognized viewType.</div>
            );
        }
    }	      
    
    viewPaneKey(side) {
        const pane = this.state[side];

		if (pane.viewType === 'ImageGridView') {
			return `${side}-${pane.viewType}`;
		} else {
			if(typeof pane.folio !== 'undefined'){
				return `${side}-${pane.viewType}-${pane.folio.id}`;
			}else{
				return `${side}-${pane.viewType}`;
			}
		}
	}

    render() {
        if( !this.props.document.loaded ) { return null; }

        // combine component state with state from props
        const docView = {
            ...this.state,
            left: this.viewportState('left'),
            right: this.viewportState('right')
        };
        const mobileDocView = {
            ...this.state,
            right: {...this.viewportState('right'), isGridMode: false},
        }
        
        if(isWidthUp('md', this.props.width)){
            return (
                <div>
                    <SplitPaneView
                        leftPane={this.renderPane('left', docView)}
                        rightPane={this.renderPane('right', docView)}
                        inSearchMode={false}
                        onWidth={this.onWidth.bind(this)}
                    />
                </div>
            );
        } else {
            return (
                <div>
                    <SinglePaneView
                        singlePane={this.renderPane('right', mobileDocView)}
                    />
                </div>
            );        }

    }

}

function mapStateToProps(state) {
	return {
        document: state.document
	};
}

export default withWidth() (connect(mapStateToProps)(DocumentView));
