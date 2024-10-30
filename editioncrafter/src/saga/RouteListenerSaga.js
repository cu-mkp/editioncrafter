/* eslint-disable prefer-destructuring */
import { takeEvery, select } from 'redux-saga/effects';

// eslint-disable-next-line import/no-cycle
import { putResolveAction } from '../model/ReduxStore';
import { loadFolio } from '../model/Folio';

const justDocument = state => state.document;
const justGlossary = state => state.glossary;

function* userNavigation(action) {
  const { pathname } = action.payload.params[0];
  const pathSegments = pathname.split('/');

  if (pathSegments.length > 1) {
    switch (pathSegments[1]) {
      case 'ec':
      {
        const manifest = yield resolveDocumentManifest();
        yield resolveGlossary();
        yield resolveFolio(pathSegments);
        break;
      }
      default:
    }
  }
}

function* resolveDocumentManifest() {
  const document = yield select(justDocument);
  if (!document.loaded) {
    // handle the case where we've passed in an array of manifest URLs, in which case the `variorum` parameter should be set to `true`
    if (document.variorum) {
      const variorumData = {};
      for (const key of Object.keys(document.manifestURL)) {
        const response = yield fetch(document.manifestURL[key]);
        variorumData[key] = yield response.json();
      }
      const variorumManifest = {
        type: 'variorum',
        documentData: variorumData,
      };
      yield putResolveAction('DocumentActions.loadDocument', variorumManifest);
      return variorumManifest;
    }
    const singleResponse = yield fetch(document.manifestURL);
    const json = yield singleResponse.json();
    yield putResolveAction('DocumentActions.loadDocument', json);
    return json;
  }

  return null;
}

function* resolveFolio(pathSegments) {
  const document = yield select(justDocument);
  if (document.loaded) {
    let leftID; let
      rightID; let thirdID;
    if (pathSegments.length > 2) {
      leftID = pathSegments[2];
      if (pathSegments.length > 4) {
        rightID = pathSegments[4];
        if (pathSegments.length > 6) {
          thirdID = pathSegments[6];
        }
      }
    }
    const folioIDs = [];
    folioIDs.push(leftID);
    if (rightID && rightID !== leftID) folioIDs.push(rightID);
    if (thirdID && thirdID !== leftID && thirdID !== rightID) folioIDs.push(thirdID);

    for (const folioID of folioIDs) {
      const folioData = document.folioIndex[folioID];
      if (folioData && !folioData.loading) {
        // wait for folio to load and then advance state
        const folio = yield loadFolio(folioData);
        yield putResolveAction('DocumentActions.loadFolio', folio);
      }
    }
  }
}

function* resolveGlossary() {
  const glossary = yield select(justGlossary);
  // NOTE: need to figure out how to deal with glossary for multidocument manifests
  if (!glossary.loaded && glossary.URL) {
    const response = yield fetch(glossary.URL);
    const json = yield response.json();
    yield putResolveAction('GlossaryActions.loadGlossary', json);
  }
}

export default function* routeListenerSaga() {
  yield takeEvery('RouteListenerSaga.userNavigatation', userNavigation);
}
