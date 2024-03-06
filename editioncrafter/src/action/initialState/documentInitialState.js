export default function documentInitalState(iiifManifest, documentName, transcriptionTypes, variorum = false, derivativeNames = null, threePanel = false) {
  return {
    documentName,
    derivativeNames,
    manifestURL: iiifManifest,
    transcriptionTypes,
    variorum,
    threePanel,
    folios: [],
    loaded: false,
    folioIndex: {},
    folioByName: {},
  };
}
