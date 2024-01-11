export default function documentInitalState(iiifManifest, documentName, transcriptionTypes, variorum = false) {
  return {
    documentName: documentName,
    manifestURL: iiifManifest,
    transcriptionTypes,
    variorum: variorum,
    folios: [],
    loaded: false,
    folioIndex: {},
    folioByName: {},
  };
}
