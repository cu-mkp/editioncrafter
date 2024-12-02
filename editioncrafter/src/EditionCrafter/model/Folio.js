import OpenSeadragon from 'openseadragon'
import { layoutMargin3 } from './folioLayout'

export async function loadFolio(folioData) {
  if (folioData.loading) {
    return folioData
  }

  folioData.loading = true
  const folio = { ...folioData }
  const transcriptionTypes = Object.keys(folio.annotationURLs)
  const transcriptionTypeTracker = Object.fromEntries(transcriptionTypes.map(t => [t, false]))

  const isIIIF = folio.image_zoom_url.endsWith('.json')

  if (isIIIF) {
    const response = await fetch(folio.image_zoom_url)
    const imageServerResponse = await response.json()
    // Handle the image server response
    folio.tileSource = new OpenSeadragon.IIIFTileSource(imageServerResponse)
  } else {
    folio.tileSource = new OpenSeadragon.ImageTileSource({
      type: 'image',
      url: folio.image_zoom_url,
    })
  }

  if (transcriptionTypes.length > 0) {
    for await (const transcriptionType of transcriptionTypes) {
      const { htmlURL, xmlURL } = folio.annotationURLs[transcriptionType]
      if (!folio.transcription)
        folio.transcription = {}
      folio.transcription[transcriptionType] = {}

      try {
        const htmlURLResponse = await fetch(htmlURL)
        const xmlURLResponse = await fetch(xmlURL)
        const html = await htmlURLResponse.text()
        const xml = await xmlURLResponse.text()
        const transcription = parseTranscription(html, xml)
        if (!transcription) {
          throw new Error(`Unable to load transcription: ${htmlURL}`)
        }
        else {
          folio.transcription[transcriptionType] = transcription
          folio.loading = false
          transcriptionTypeTracker[transcriptionType] = true
        }
      }
      catch (error) {
        folioData.loading = false
        throw error
      }
    }

    // Once all transcription types have been fetched
    if (Object.values(transcriptionTypeTracker).filter(v => !v).length === 0) {
      return folio
    }
  }

  folio.loading = false
  return folio
}

// returns transcription or error message if unable to parse
function parseTranscription(html, xml) {
  const transcriptionData = layoutMargin3(html)
  return {
    ...transcriptionData,
    xml,
  }
}
