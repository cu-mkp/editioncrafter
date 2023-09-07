const DocumentActions = {};

// Profile ID for EditionCrafter text partials
const textPartialResourceProfileID = 'https://github.com/cu-mkp/editioncrafter-project/text-partial-resource.md';

DocumentActions.loadDocument = function loadDocument(state, manifestData) {
  const folios = parseManifest(manifestData, state.transcriptionTypes);
  const { folioIndex, folioByName } = createFolioIndex(folios);

  return {
    ...state,
    loaded: true,
    folios,
    folioIndex,
    folioByName,
  };
};

DocumentActions.loadFolio = function loadFolio(state, folio) {
  const oldFolio = state.folioIndex[folio.id];
  const folioIdx = state.folios.indexOf(oldFolio);
  state.folios[folioIdx] = folio;
  state.folioIndex[folio.id] = folio;
  state.folioByName[folio.name] = folio;
  return {
    ...state,
  };
};

function createFolioIndex(folios) {
  // Store an ordered array of folio ids, used for next/prev navigation purposes later
  const folioIndex = {};
  const folioByName = {};
  for (let idx = 0; idx < folios.length; idx++) {
    const folio = folios[idx];
    folioIndex[folio.id] = folio;
    folioByName[folio.name] = folio;
  }
  return { folioIndex, folioByName };
}

function throwError(message) {
  throw new Error(`IIIF manifest parser error: ${message}`);
}

function displayWarning(message) {
  console.warn(`IIIF manifest parser warning: ${message}`);
}

function parseImageURLs(canvas) {
  for (const annotationPage of canvas.items) {
    if (annotationPage.type !== 'AnnotationPage') throwError(`Expected AnnotationPage in items property of ${canvas.id}`);
    if (!annotationPage.items) throwError(`Expected items property in AnnotationPage ${annotationPage.id}`);
    for (const annotation of annotationPage.items) {
      if (annotation.type !== 'Annotation') throwError(`Expected Annotation in items property of ${annotationPage.id}`);
      if (annotation.motivation === 'painting') {
        if (!annotation.body) throwError(`Expected body property in Annotation ${annotation.id}`);
        return {
          bodyId: annotation.body.id,
          imageURL: `${annotation.body.id}/info.json`,
        };
      }
    }
  }
  throwError(`Unable to find painting Annotation for canvas: ${canvas.id}`);
  return null;
}

function parseLabel(parent) {
  // TODO support labels in different languages, multiple labels in same language
  if (!parent.label) {
    displayWarning(`${parent.id} does not have a label property.`);
    return '';
  }
  return parent.label.none[0];
}

function parseAnnotationURLs(canvas, transcriptionTypes) {
  const annos = {};

  if (canvas.annotations) {
    for (const annotationPage of canvas.annotations) {
      if (annotationPage.type === 'AnnotationPage') {
        if (!annotationPage.items) throwError(`Expected items property in AnnotationPage ${annotationPage.id}`);
        for (const annotation of annotationPage.items) {
          if (annotation.type !== 'Annotation') throwError(`Expected Annotation in items property of ${annotationPage.id}`);
          if (annotation.motivation === 'supplementing') {
            if (!annotation.body) throwError(`Expected body property in Annotation ${annotation.id}`);
            const { body: annotationBody } = annotation;
            if (annotationBody.profile === textPartialResourceProfileID && annotationBody.type === 'TextPartial') {
              if (!annotationBody.id) throwError(`Expected id property in TextPartial in ${annotation.id}`);
              if (!annotationBody.format) throwError(`Expected format property in TextPartial in ${annotation.id}`);
              const { id, format } = annotationBody;
              const idParts = id.split('/');
              if (idParts.length < 5) throwError(`TextPartial id property is in the wrong format: ${id}`);
              const transcriptionTypeID = idParts[idParts.length - 2];
              if (transcriptionTypes[transcriptionTypeID]) {
                if (!annos[transcriptionTypeID]) annos[transcriptionTypeID] = {};
                if (format === 'text/html') annos[transcriptionTypeID].htmlURL = id;
                if (format === 'text/xml') annos[transcriptionTypeID].xmlURL = id;
              }
            }
          }
        }
      }
    }
  }

  return annos;
}

// The largest dimension for either width or height allowed in a thumbnail.
const MAX_THUMBNAIL_DIMENSION = 130;

function parseManifest(manifest, transcriptionTypes) {
  const folios = [];

  // make sure this is a IIIF Presentation API v3 Manifest
  if (!manifest['@context'] || !manifest['@context'].includes('http://iiif.io/api/presentation/3/context.json')) {
    throwError('Expected root object to have a @context containing: http://iiif.io/api/presentation/3/context.json');
  }

  if (manifest.type !== 'Manifest') throwError("Expected root object of type 'Manifest'.");
  if (!manifest.items) throwError('Expected manifest to have an items property.');
  const canvases = manifest.items;

  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    if (canvas.type !== 'Canvas') throwError(`Expected items[${i}] to be of type 'Canvas'.`);
    if (!canvas.id) throwError(`Expected items[${i}] to have an id property.`);
    const folioID = canvas.id.substr(canvas.id.lastIndexOf('/') + 1);
    const canvasLabel = parseLabel(canvas);
    const { bodyId, imageURL } = parseImageURLs(canvas);
    const annotationURLs = parseAnnotationURLs(canvas, transcriptionTypes);

    const ratio = canvas.width / canvas.height;

    let thumbnailDimensions = [];
    if (ratio > 1) {
      thumbnailDimensions = [MAX_THUMBNAIL_DIMENSION, Math.round(MAX_THUMBNAIL_DIMENSION / ratio)];
    } else {
      thumbnailDimensions = [Math.round(MAX_THUMBNAIL_DIMENSION * ratio), MAX_THUMBNAIL_DIMENSION];
    }

    const thumbnailURL = `${bodyId}/full/${thumbnailDimensions.join(',')}/0/default.jpg`;

    const folio = {
      id: folioID,
      name: canvasLabel,
      pageNumber: i,
      image_zoom_url: imageURL,
      image_thumbnail_url: thumbnailURL,
      annotationURLs,
      annotations: canvas.annotations
        ? canvas.annotations.filter(a => a.motivation === 'tagging')
        : [],
    };

    folios.push(folio);
  }

  return folios;
}

export default DocumentActions;
