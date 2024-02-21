export default function documentInitalState(iiifManifest, documentName, transcriptionTypes, variorum = false, derivativeNames = null, threePanel = false, thumbnails = true) {
  return {
    documentName,
    derivativeNames,
    manifestURL: iiifManifest,
    transcriptionTypes,
    variorum,
    threePanel,
    thumbnails,
    folios: [],
    loaded: false,
    folioIndex: {},
    folioByName: {},
  };
}
