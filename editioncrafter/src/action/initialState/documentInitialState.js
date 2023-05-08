export default function documentInitalState(iiifManifest, documentName, transcriptionTypes) {
  return {
    documentName: documentName,
    manifestURL: iiifManifest,
    transcriptionTypes,
    folios: [],
    loaded: false,
    folioIndex: {},
    folioByName: {},
  };
}
