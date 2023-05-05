import axios from 'axios';
import { takeEvery, select } from 'redux-saga/effects';

import { putResolveAction } from '../model/ReduxStore';
import { loadFolio } from '../model/Folio';

const justDocument = state => state.document;
const justGlossary = state => state.glossary;
const justComments = state => state.comments;

function* userNavigation(action) {
  const { pathname } = action.payload.params[0];
  const pathSegments = pathname.split('/');

  if (pathSegments.length > 1) {
    switch (pathSegments[1]) {
      case 'ec':
        yield resolveComments();
        yield resolveDocumentManifest();
        yield resolveGlossary();
        yield resolveFolio(pathSegments);
        break;
      default:
    }
  }
}

function* resolveDocumentManifest() {
  const document = yield select(justDocument);
  if (!document.loaded) {
    const response = yield axios.get(document.manifestURL);
    yield putResolveAction('DocumentActions.loadDocument', response.data);
  }
}

function* resolveFolio(pathSegments) {
  const document = yield select(justDocument);
  if (document.loaded) {
    let leftID, rightID;
    if( pathSegments.length > 2 ) {
      leftID = pathSegments[2];
      if( pathSegments.length > 4 ) {
        rightID = pathSegments[4];
      }
    }
    const folioIDs = [];
    folioIDs.push(leftID);
    if( rightID && rightID !== leftID ) folioIDs.push(rightID);

    for( const folioID of folioIDs ) {
      const folioData = document.folioIndex[folioID];
      if( folioData && !folioData.loading ) {
        // wait for folio to load and then advance state
        const folio = yield loadFolio(folioData);
        yield putResolveAction('DocumentActions.loadFolio', folio);
      }
    }
  }
}

function* resolveGlossary() {
  const glossary = yield select(justGlossary);
  if (!glossary.loaded) {
    const response = yield axios.get(glossary.glossaryURL);
    yield putResolveAction('GlossaryActions.loadGlossary', response.data);
  }
}

function* resolveComments() {
  const comments = yield select(justComments);
  if (!comments.loaded) {
    const response = yield axios.get(comments.commentsURL);
    yield putResolveAction('CommentActions.loadComments', response.data);
  }
}

export default function* routeListenerSaga() {
  yield takeEvery('RouteListenerSaga.userNavigatation', userNavigation);
}
