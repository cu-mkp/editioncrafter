function getHeaderUrlFromManifestUrl(manifestUrl) {
  const truncated = manifestUrl.replace('/iiif/manifest.json', '')
  return `${truncated}/html/index.html`
}

function getHeaderUrlsFromManifestUrls(data) {
  if (typeof manifestUrl === 'string') {
    return getHeaderUrlFromManifestUrl(data)
  }

  const result = {}

  Object.entries(data).forEach((ent) => {
    result[ent[0]] = getHeaderUrlFromManifestUrl(ent[1])
  })

  return result
}

export default function documentInitalState(iiifManifest, documentName, transcriptionTypes, variorum = false, derivativeNames = null, threePanel = false) {
  return {
    documentName,
    derivativeNames,
    manifestURL: iiifManifest,
    headerUrl: getHeaderUrlsFromManifestUrls(iiifManifest),
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
