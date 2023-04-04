import Folio from '../model/Folio';

const DocumentActions = {};

// Profile ID for EditionCrafter text partials
const textPartialResourceProfileID = 'https://github.com/cu-mkp/editioncrafter-project/text-partial-resource.md';

DocumentActions.loadDocument = function loadDocument(state, manifestData) {
  const folios = parseManifest(manifestData, state.channels);
  const { folioIndex, folioByName } = createFolioIndex(folios);
  return {
    ...state,
    loaded: true,
    folios,
    folioIndex,
    folioByName,
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
        if (!annotation.body.thumbnail) throwError(`Expected body.thumbnail property in Annotation ${annotation.id}`);
        const thumbnailURL = annotation.body.thumbnail[0].id;
        if (!thumbnailURL) throwError(`Unable to find thumbnail for resource: ${annotation.body.id}`);
        return { imageURL: `${annotation.body.id}/info.json`, thumbnailURL };
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

function parseAnnotationURLs(canvas, channels) {
  const annos = {};

  if (canvas.annotations) {
    for (const annotationPage of canvas.annotations) {
      if (annotationPage.type !== 'AnnotationPage') throwError(`Expected AnnotationPage in annotations property of ${canvas.id}`);
      if (!annotationPage.items) throwError(`Expected items property in AnnotationPage ${annotationPage.id}`);
      for (const annotation of annotationPage.items) {
        if (annotation.type !== 'Annotation') throwError(`Expected Annotation in items property of ${annotationPage.id}`);
        if (annotation.motivation === 'supplementing') {
          if (!annotation.body) throwError(`Expected body property in Annotation ${annotation.id}`);
          const { body: annotationBody } = annotation;
          if (annotationBody.profile === textPartialResourceProfileID && annotationBody.type === 'TextPartial') {
            const { id, format } = annotationBody;
            const label = parseLabel(annotationBody);
            for (const channelName of Object.keys(channels)) {
              const channel = channels[channelName];
              if (channel.includes(label)) {
                if (!annos[channelName]) annos[channelName] = {};
                if (format === 'text/html') annos[channelName].htmlURL = id;
                if (format === 'text/xml') annos[channelName].xmlURL = id;
              }
            }
          }
        }
      }
    }
  }
  return annos;
}

function parseManifest(manifest, channels) {
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
    const canvasLabel = parseLabel(canvas);
    const { imageURL, thumbnailURL } = parseImageURLs(canvas);
    const annotationURLs = parseAnnotationURLs(canvas, channels);

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
