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

function parseManifest(manifest) {
  const folios = [];
  const { canvases } = manifest.sequences[0];

  for (const canvas of canvases) {
    const canvasID = canvas['@id'];
    const canvasLabel = canvas.label;
    const imageURL = `${canvas.images[0].resource.service['@id']}/info.json`;
    const thumbnailURL = `${canvas.thumbnail['@id']}/full/native.jpg`;
    let annotationListURL = null;

    if (canvas.otherContent) {
      annotationListURL = canvas.otherContent[0]['@id'];
    }

    const folio = new Folio({
      id: canvasID,
      name: canvasLabel,
      image_zoom_url: imageURL,
      image_thumbnail_url: thumbnailURL,
      annotationListURL,
    });

    folios.push(folio);
  }

  return folios;
}

export default DocumentActions;
