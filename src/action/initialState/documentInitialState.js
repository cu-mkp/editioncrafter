export default function documentInitalState(editionBaseURL, channels) {
  return {
    currentDocumentName: 'BnF Ms. Fr. 640',
    manifestURL: `${editionBaseURL}/iiif/manifest.json`,
    channels,
    folios: [],
    loaded: false,
    folioIndex: {},
    folioByName: {},
  };
}
