function getHeaderUrlFromManifestUrl(manifestUrl) {
  const truncated = manifestUrl.replace('/iiif/manifest.json', '')
  return `${truncated}/html/index.html`
}

export default function documentInitalState(iiifManifest, documentName, transcriptionTypes, variorum = false, derivativeNames = null, threePanel = false) {
  return {
    documentName,
    derivativeNames,
    manifestURL: iiifManifest,
    headerUrl: getHeaderUrlFromManifestUrl(iiifManifest),
    transcriptionTypes,
    variorum,
    threePanel,
    folios: [],
    loaded: false,
    folioIndex: {},
    folioByName: {},
    tags: null,
  }
}
