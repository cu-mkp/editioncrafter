import { combineReducers } from 'redux';

import { createReducer } from '../model/ReduxStore';
import GlossaryActions from './GlossaryActions';
import DocumentActions from './DocumentActions';
import DiplomaticActions from './DiplomaticActions';

import diplomaticInitialState from './initialState/diplomaticInitialState';
import glossaryInitialState from './initialState/glossaryInitialState';
import documentInitialState from './initialState/documentInitialState';

export default function rootReducer(config) {
  const {
    iiifManifest, documentName, transcriptionTypes, variorum = false
  } = config;
  return combineReducers({
    diplomatic: createReducer('DiplomaticActions', DiplomaticActions, diplomaticInitialState),
    document: createReducer('DocumentActions', DocumentActions, documentInitialState(iiifManifest, documentName, transcriptionTypes, variorum)),
    glossary: createReducer('GlossaryActions', GlossaryActions, glossaryInitialState()),
  });
}
