export default function documentInitalState(iiifManifest, documentName, transcriptionTypes, variorum = false, derivativeNames = null) {
  return {
    documentName,
    derivativeNames,
    manifestURL: iiifManifest,
    transcriptionTypes,
    variorum,
    folios: [],
    loaded: false,
    folioIndex: {},
    folioByName: {},
  };
}
