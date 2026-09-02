function getHeaderUrlFromManifestUrl(manifestUrl) {
  const truncated = manifestUrl.replace('/iiif/manifest.json', '')
  return `${truncated}/html/index.html`
}

function getHeaderUrlsFromManifestUrls(data) {
  if (typeof data === 'string') {
    return getHeaderUrlFromManifestUrl(data)
  }

  const result = {}

  Object.entries(data).forEach((ent) => {
    result[ent[0]] = getHeaderUrlFromManifestUrl(ent[1])
  })

  return result
}

export default function documentInitalState(iiifManifest, documentName, transcriptionTypes, variorum = false, derivativeNames = null, threePanel = false, tagExplorerMode = false) {
  return {
    documentName,
    derivativeNames,
    manifestURL: iiifManifest,
    headerUrl: getHeaderUrlsFromManifestUrls(iiifManifest),
    transcriptionTypes,
    variorum,
    threePanel,
    folios: [],
    // When using the Tag Explorer view, we don't
    // have a single upfront manifest fetch to wait on -- an unselected pane
    // just shows an empty-state placeholder, and each document's manifest
    // is fetched lazily once a folio from it is actually selected. A
    // single-document edition still needs its one manifest before it has
    // anything to show.
    loaded: tagExplorerMode,
    loadedManifestKeys: {},
    folioIndex: {},
    folioByName: {},
    tagExplorerMode,
    tags: tagExplorerMode ? {} : null,
  }
}
