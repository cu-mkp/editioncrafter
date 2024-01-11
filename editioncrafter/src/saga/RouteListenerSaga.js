import axios from 'axios';
import { takeEvery, select } from 'redux-saga/effects';

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
        yield resolveGlossary(manifest);
        yield resolveFolio(pathSegments);
        break;
      }
      default:
    }
  }
}

function* resolveDocumentManifest() {
  const document = yield select(justDocument);
  console.log(document);
  if (!document.loaded) {
    // handle the case where we've passed in an array of manifest URLs, in which case the `variorum` parameter should be set to `true`
    if (document.variorum) {
      let variorumData = {};
      for (var url of document.manifestURL) {
        const response = yield axios.get(url);
        variorumData[response.data.id] = response.data;
      };
      const variorumManifest = {
        type: "variorum",
        documentData: variorumData
      };
      yield putResolveAction('DocumentActions.loadDocument', variorumManifest);
      return variorumManifest;
    }
    else {
      const singleResponse = yield axios.get(document.manifestURL);
      yield putResolveAction('DocumentActions.loadDocument', singleResponse.data);
      return singleResponse.data;
    }
  }

  return null;
}

function* resolveFolio(pathSegments) {
  const document = yield select(justDocument);
  if (document.loaded) {
    let leftID; let
      rightID;
    if (pathSegments.length > 2) {
      leftID = pathSegments[2];
      if (pathSegments.length > 4) {
        rightID = pathSegments[4];
      }
    }
    const folioIDs = [];
    folioIDs.push(leftID);
    if (rightID && rightID !== leftID) folioIDs.push(rightID);

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

function* resolveGlossary(manifest) {
  const glossary = yield select(justGlossary);
  if (!glossary.loaded) {
    if (
      !manifest?.seeAlso
      || manifest.seeAlso.length === 0
      || !manifest.seeAlso[0].id
    ) {
      throw new Error('Missing glossary link in seeAlso array.');
    }

    const glossaryURL = manifest.seeAlso[0].id;
    const response = yield axios.get(glossaryURL);
    yield putResolveAction('GlossaryActions.loadGlossary', response.data);
  }
}

export default function* routeListenerSaga() {
  yield takeEvery('RouteListenerSaga.userNavigatation', userNavigation);
}
