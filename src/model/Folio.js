import OpenSeadragon from 'openseadragon';
import axios from 'axios';
import { layoutMargin3 } from './folioLayout';

class Folio {
  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.pageNumber = props.pageNumber;
    this.image_zoom_url = props.image_zoom_url;
    this.image_thumbnail_url = props.image_thumbnail_url;
    this.annotationURLs = props.annotationURLs;
    this.tileSource = null;
    this.transcription = {};
    this.loading = false;
  }

  load() {
    if (this.loading) {
      // promise to resolve this immediately
      return new Promise((resolve) => {
        resolve(this);
      });
    }
    this.loading = true;
    // promise to load all the data for this folio
    return new Promise((resolve, reject) => {
      if (this.annotationURLs) {
        axios.get(this.image_zoom_url).then((imageServerResponse) => {
          // Handle the image server response
          this.tileSource = new OpenSeadragon.IIIFTileSource(imageServerResponse.data);

          for (const transcriptionType of Object.keys(this.annotationURLs)) {
            const { htmlURL, xmlURL } = this.annotationURLs[transcriptionType];
            this.transcription[transcriptionType] = {};
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
                this.transcription[transcriptionType] = transcription;
                console.log("loaded folio")
                resolve(this);
              }
            }))
              .catch((error) => {
                reject(error);
              });
          }
        })
          .catch((error) => {
            reject(error);
          });
      } else {
        // if there is no annotatation list, just load the image and provide a blank transcription
        axios.get(this.image_zoom_url)
          .then((imageServerResponse) => {
            this.tileSource = new OpenSeadragon.IIIFTileSource(imageServerResponse.data);
            resolve(this);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }
}

// returns transcription or error message if unable to parse
function parseTranscription(html, xml) {
  const transcriptionData = layoutMargin3(html);
  return {
    ...transcriptionData,
    xml
  };
}

export default Folio;
