import Folio from '../model/Folio';

const DocumentActions = {};

DocumentActions.loadDocument = function loadDocument(state, manifestData) {
  const folios = parseManifest(manifestData);
  const { folioIndex, nameByID, idByName } = createFolioIndex(folios);
  return {
    ...state,
    loaded: true,
    folios,
    folioIndex,
    folioNameByIDIndex: nameByID,
    folioIDByNameIndex: idByName,
  };
};

function createFolioIndex(folios) {
  // Store an ordered array of folio ids, used for next/prev navigation purposes later
  const folioIndex = [];
  const nameByID = {};
  const idByName = {};
  for (let idx = 0; idx < folios.length; idx++) {
    const shortID = folios[idx].id.substr(folios[idx].id.lastIndexOf('/') + 1);
    folioIndex.push(shortID);
    nameByID[shortID] = folios[idx].name;
    idByName[folios[idx].name] = shortID;
  }
  return { folioIndex, nameByID, idByName };
}

function throwError(message) {
  throw new Error(`IIIF manifest parser error: ${message}`)
}

function displayWarning(message) {
  console.warn(`IIIF manifest parser warning: ${message}`)
}

function parseImageURL(canvas) {
  for( const annotationPage of canvas.items ) {
      
  }
  // look for an annotation page containing an annotation with a painting motivation
  // the ID of the body is the image API URL
  // add info.json to it
}

function parseLabel(canvas) {
  // TODO support labels in different languages, multiple labels in same language
  if( !canvas.label ) {
    displayWarning(`${canvas.id} does not have a label property.`);
    return "";
  }
  return canvas.label.none[0]
}

function parseThumbnailURL(canvas) {
  // TODO 
  // `${canvas.thumbnail['@id']}/full/native.jpg`;
}

function parseAnnotationURLs(canvas) {
  // TODO
}

function parseManifest(manifest) {
  const folios = [];

  // make sure this is a IIIF Presentation API v3 Manifest 
  if( !manifest['@context'] || manifest['@context'].includes("http://iiif.io/api/presentation/3/context.json") ) {
    throwError("Expected root object to have a @context containing: http://iiif.io/api/presentation/3/context.json");
  }

  if( manifest.type !== "Manifest" ) throwError("Expected root object of type 'Manifest'.");
  if( !manifest.items ) throwError("Expected manifest to have an items property.");
  const canvases = manifest.items;

  for ( let i=0; i < canvases.length; i++) {
    const canvas = canvases[i]
    if( canvas.type !== "Canvas" ) throwError(`Expected items[${i}] to be of type 'Canvas'.`);
    if( !canvas.id ) throwError(`Expected items[${i}] to have an id property.`);
    const canvasLabel = parseLabel(canvas);
    const imageURL = parseImageURL(canvas);
    const thumbnailURL = parseThumbnailURL(canvas);
    const annotationURLs = parseAnnotationURLs(canvas);

    const folio = new Folio({
      id: canvas.id,
      name: canvasLabel,
      image_zoom_url: imageURL,
      image_thumbnail_url: thumbnailURL,
      annotationURLs,
    });

    folios.push(folio);
  }

  return folios;
}

export default DocumentActions;
