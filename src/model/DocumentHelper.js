const DocumentHelper = {};

const folioNameRegex = /\d{1,3}[r|v]/;

DocumentHelper.transcriptionTypeLabels = {
  tc: 'Diplomatic (FR)',
  tcn: 'Normalized (FR)',
  tl: 'Translation (EN)',
  f: 'Facsimile',
  anno: 'Research Esssay',
  glossary: 'Glossary',
};

DocumentHelper.getFolio = function getFolio(document, folioID) {
  return document.folios.find((folio) => (folio.id === folioID));
};

DocumentHelper.validFolioName = function validFolioName(folioName) {
  if (!folioName || folioName.length === 0) return null;

  if (folioName.match(folioNameRegex)) {
    return folioName;
  }
  const numericID = parseInt(folioName, 10);
  if (!isNaN(numericID)) {
    return `${numericID}r`;
  }
  return null;
};

DocumentHelper.folioURL = function (folioID) {
  return `https://gallica.bnf.fr/iiif/ark:/12148/btv1b10500001g/canvas/${folioID}`;
};

DocumentHelper.generateFolioID = function (bnfLabel) {
  // grab r or v off the end
  const rectoOrVerso = bnfLabel.slice(bnfLabel.length - 1);
  const id = parseInt(bnfLabel.slice(0, bnfLabel.length - 1), 10);

  // the beginning and end pages do not have a numeric label
  if (isNaN(id)) return null;

  // figure out how much padding we need
  let zeros = '';

  if (id < 10) {
    zeros += '0';
  }

  if (id < 100) {
    zeros += '0';
  }

  return `p${zeros.concat(id)}${rectoOrVerso}`;
};

export default DocumentHelper;
