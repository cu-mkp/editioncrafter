import OpenSeadragon from 'openseadragon';
import axios from 'axios';
import { layoutMargin3 } from './folioLayout';

export function loadFolio(folioData) {
  if (folioData.loading) {
    // promise to resolve this immediately
    return new Promise((resolve) => {
      resolve(folioData);
    });
  }
  folioData.loading = true;
  const folio = { ...folioData };

  // promise to load all the data for this folio
  return new Promise((resolve, reject) => {
    const transcriptionTypes = Object.keys(folio.annotationURLs);
    const transcriptionTypeTracker = Object.fromEntries(transcriptionTypes.map((t) => [t, false]));
    if (transcriptionTypes.length > 0) {
      axios.get(folio.image_zoom_url).then((imageServerResponse) => {
        // Handle the image server response
        folio.tileSource = new OpenSeadragon.IIIFTileSource(imageServerResponse.data);

        for (const transcriptionType of transcriptionTypes) {
          const { htmlURL, xmlURL } = folio.annotationURLs[transcriptionType];
          if( !folio.transcription ) folio.transcription = {};
          folio.transcription[transcriptionType] = {};
          axios.all([
            axios.get(htmlURL),
            axios.get(xmlURL),
          ]).then(axios.spread((
            htmlResponse,
            xmlResponse,
          ) => {
            const transcription = parseTranscription(htmlResponse.data, xmlResponse.data);
            if (!transcription) {
              reject(new Error(`Unable to load transcription: ${htmlURL}`));
            } else {
              folio.transcription[transcriptionType] = transcription;
              folio.loading = false;
              transcriptionTypeTracker[transcriptionType] = true;
            }
          }))
            .catch((error) => {
              folioData.loading = false;
              reject(error);
            })
            .finally(() => {
              // Only resolve once all transcription types have been fetched
              if (Object.values(transcriptionTypeTracker).filter(v => !v).length === 0) {
                resolve(folio);
              }
            });
        }
      })
        .catch((error) => {
          folioData.loading = false;
          reject(error);
        });
    } else {
      // if there is no annotatation list, just load the image and provide a blank transcription
      axios.get(folio.image_zoom_url)
        .then((imageServerResponse) => {
          folio.tileSource = new OpenSeadragon.IIIFTileSource(imageServerResponse.data);
          folio.loading = false;
          resolve(folio);
        })
        .catch((error) => {
          folioData.loading = false;
          reject(error);
        });
    }
  });
}

// returns transcription or error message if unable to parse
function parseTranscription(html, xml) {
  const transcriptionData = layoutMargin3(html);
  return {
    ...transcriptionData,
    xml
  };
}
