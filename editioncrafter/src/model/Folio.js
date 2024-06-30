import OpenSeadragon from 'openseadragon';
import { layoutMargin3 } from './folioLayout';

export async function loadFolio(folioData) {
  if (folioData.loading) {
    return folioData
  }

  folioData.loading = true;
  const folio = { ...folioData };
  const transcriptionTypes = Object.keys(folio.annotationURLs);
  const transcriptionTypeTracker = Object.fromEntries(transcriptionTypes.map((t) => [t, false]));

  if (transcriptionTypes.length > 0) {
    const response = await fetch(folio.image_zoom_url)
    const imageServerResponse = await response.json()
    // Handle the image server response
    folio.tileSource = new OpenSeadragon.IIIFTileSource(imageServerResponse);

    for (const transcriptionType of transcriptionTypes) {
      const { htmlURL, xmlURL } = folio.annotationURLs[transcriptionType];
      if (!folio.transcription) folio.transcription = {};
      folio.transcription[transcriptionType] = {};

      try {
        const htmlURLResponse = await fetch(htmlURL)
        const xmlURLResponse = await fetch(xmlURL)
        const html = await htmlURLResponse.text()
        const xml = await xmlURLResponse.text()
        const transcription = parseTranscription(html, xml);
        if (!transcription) {
          throw new Error(`Unable to load transcription: ${htmlURL}`)
        } else {
          folio.transcription[transcriptionType] = transcription;
          folio.loading = false;
          transcriptionTypeTracker[transcriptionType] = true;
        }  
      } catch(error) {
          folioData.loading = false;
          throw error;
      }
    }

    // Once all transcription types have been fetched
    if (Object.values(transcriptionTypeTracker).filter(v => !v).length === 0) {
      return folio;
    }
  } else {
    // if there is no annotatation list, just load the image and provide a blank transcription
    try {
      const response = await fetch(folio.image_zoom_url)
      const imageServerResponse = await response.json()
      folio.tileSource = new OpenSeadragon.IIIFTileSource(imageServerResponse);
      folio.loading = false;
      return folio
    } 
    catch(error) {
        folioData.loading = false;
        throw error;
    }
  }
}

// returns transcription or error message if unable to parse
function parseTranscription(html, xml) {
  const transcriptionData = layoutMargin3(html);
  return {
    ...transcriptionData,
    xml,
  };
}
