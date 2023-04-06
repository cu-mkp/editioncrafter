import OpenSeadragon from 'openseadragon';
import axios from 'axios';

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
    this.loaded = false;
  }

  load() {
    if (this.loaded) {
      // promise to resolve this immediately
      return new Promise((resolve) => {
        resolve(this);
      });
    }
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
                this.loaded = true;
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
            this.loaded = true;
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
  // const folioTag = '<folio';
  // const openDivIndex = html.indexOf(folioTag);
  // if (openDivIndex === -1) return errorMessage('Folio element not found.');
  // const start = html.indexOf('>', openDivIndex) + 1;
  // const end = html.lastIndexOf('</folio>');
  // if (end === -1) return errorMessage('Folio element closing tag not found.');
  // if (start > end) return errorMessage('Unable to parse folio element.');

  // // detect folio mode
  // const folioAttribs = html.slice(openDivIndex + folioTag.length, start - 1);
  // const layoutAttr = 'layout=';
  // const layoutAttrIndex = folioAttribs.indexOf(layoutAttr);
  // if (layoutAttrIndex === -1) return errorMessage('Unable to parse layout attribute in folio element.');
  // const layoutAttrStart = layoutAttrIndex + layoutAttr.length + 1;
  // const layoutType = folioAttribs.slice(layoutAttrStart, folioAttribs.indexOf('"', layoutAttrStart));
  // const transcription = html.slice(start, end);
  return {
    layout: 'default',
    html,
    xml,
  };
}

function errorMessage(message) {
  return {
    layout: 'margin',
    html: `<div id="error"><div data-layout="middle">${message}</div></div>`,
  };
}

export default Folio;
