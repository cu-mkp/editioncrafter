import axios from 'axios';
import { takeEvery, select } from 'redux-saga/effects';

import { putResolveAction } from '../model/ReduxStore';

const juxtDocument = state => state.document;
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
        break;
      default:
    }
  }
}

function* resolveDocumentManifest() {
  const document = yield select(juxtDocument);
  if (!document.loaded) {
    const response = yield axios.get(document.manifestURL);
    yield putResolveAction('DocumentActions.loadDocument', response.data);
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
