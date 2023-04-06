export default function documentInitalState(iiifManifest, transcriptionTypes) {
  return {
    currentDocumentName: 'BnF Ms. Fr. 640',
    manifestURL: iiifManifest,
    transcriptionTypes,
    folios: [],
    loaded: false,
    folioIndex: {},
    folioByName: {},
  };
}
