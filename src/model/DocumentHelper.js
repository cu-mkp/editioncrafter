const DocumentHelper = {};

DocumentHelper.transcriptionTypeLabels = {
  tc: 'Diplomatic (FR)',
  tcn: 'Normalized (FR)',
  tl: 'Translation (EN)',
  f: 'Facsimile',
  anno: 'Research Esssay',
  glossary: 'Glossary',
};

DocumentHelper.getFolio = function getFolio(document, folioID) {
  return document.folioIndex[folioID];
};

DocumentHelper.folioURL = function folioURL(document, folioID) {
  return document.folioIndex[folioID]?.image_zoom_url;
};

export default DocumentHelper;
