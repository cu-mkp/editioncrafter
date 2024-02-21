import { combineReducers } from 'redux';

// eslint-disable-next-line import/no-cycle
import { createReducer } from '../model/ReduxStore';
import GlossaryActions from './GlossaryActions';
import DocumentActions from './DocumentActions';
import DiplomaticActions from './DiplomaticActions';

import diplomaticInitialState from './initialState/diplomaticInitialState';
import glossaryInitialState from './initialState/glossaryInitialState';
import documentInitialState from './initialState/documentInitialState';

export default function rootReducer(config) {
  const {
    documentName, documentInfo, threePanel = false
  } = config;
  const variorum = documentInfo && Object.keys(documentInfo).length > 1;
  const transcriptionTypesInfo = {};
  const manifestInfo = {};
  const derivativesInfo = {};
  if (variorum) {
    Object.keys(config.documentInfo).forEach((key) => {
      transcriptionTypesInfo[key] = config.documentInfo[key].transcriptionTypes;
      manifestInfo[key] = config.documentInfo[key].iiifManifest;
      derivativesInfo[key] = config.documentInfo[key].documentName;
    });
  }
  const transcriptionTypes = variorum ? transcriptionTypesInfo : config.transcriptionTypes;
  const iiifManifest = variorum ? manifestInfo : config.iiifManifest;
  const derivativeNames = variorum && derivativesInfo;
  return combineReducers({
    diplomatic: createReducer('DiplomaticActions', DiplomaticActions, diplomaticInitialState),
    document: createReducer('DocumentActions', DocumentActions, documentInitialState(iiifManifest, documentName, transcriptionTypes, variorum, derivativeNames, threePanel)),
    glossary: createReducer('GlossaryActions', GlossaryActions, glossaryInitialState()),
  });
}
