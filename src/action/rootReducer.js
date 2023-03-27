import { combineReducers } from 'redux';

import { createReducer } from '../model/ReduxStore';
import GlossaryActions from './GlossaryActions';
import DocumentActions from './DocumentActions';
import DiplomaticActions from './DiplomaticActions';

import diplomaticInitialState from './initialState/diplomaticInitialState';
import glossaryInitialState from './initialState/glossaryInitialState';
import documentInitialState from './initialState/documentInitialState';
import CommentActions from './CommentActions';
import commentInitialState from './initialState/commentInitialState';

export default function rootReducer(config) {
  const { editionBaseURL, channels } = config;
  return combineReducers({
    diplomatic: createReducer('DiplomaticActions', DiplomaticActions, diplomaticInitialState),
    document: createReducer('DocumentActions', DocumentActions, documentInitialState(editionBaseURL, channels)),
    glossary: createReducer('GlossaryActions', GlossaryActions, glossaryInitialState(editionBaseURL)),
    comments: createReducer('CommentActions', CommentActions, commentInitialState(editionBaseURL)),
  });
}
