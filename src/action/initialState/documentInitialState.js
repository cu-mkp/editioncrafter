export default function documentInitalState(editionBaseURL) {
  return {
    currentDocumentName: 'BnF Ms. Fr. 640',
    manifestURL: `${editionBaseURL}/manifest.json`,
    folios: [],
    loaded: false,
    folioIndex: [],
    folioNameByIDIndex: {},
    folioIDByNameIndex: {},
  };
}
