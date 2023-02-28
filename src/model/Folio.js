import OpenSeadragon from 'openseadragon';
import axios from 'axios';

class Folio {
  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.image_zoom_url = props.image_zoom_url;
    this.image_thumbnail_url = props.image_thumbnail_url;
    this.annotationListURL = props.annotationListURL;
    this.tileSource = null;
    this.transcription = null;
    this.loaded = false;
  }

  load() {
    if (this.loaded) {
      // promise to resolve this immediately
      return new Promise((resolve, reject) => {
        resolve(this);
      });
    }
    // promise to load all the data for this folio
    return new Promise((resolve, reject) => {
      if (this.annotationListURL) {
        axios.all([
          axios.get(this.image_zoom_url),
          axios.get(this.annotationListURL),
        ])
          .then(axios.spread((imageServerResponse, annotationListResponse) => {
            // Handle the image server response
            this.tileSource = new OpenSeadragon.IIIFTileSource(imageServerResponse.data);

            // Grab all three transcripts and pre-cache them
            // 0 = tc (French) | 1 = tcn (French Standard) | 2 = tl (English)
            const transcriptionURL_tc = annotationListResponse.data.resources[0].resource['@id'];
            const transcriptionURL_tcn = annotationListResponse.data.resources[1].resource['@id'];
            const transcriptionURL_tl = annotationListResponse.data.resources[2].resource['@id'];
            const transcriptionURL_tc_xml = annotationListResponse.data.resources[3].resource['@id'];
            const transcriptionURL_tcn_xml = annotationListResponse.data.resources[4].resource['@id'];
            const transcriptionURL_tl_xml = annotationListResponse.data.resources[5].resource['@id'];
            axios.all([
              axios.get(transcriptionURL_tc),
              axios.get(transcriptionURL_tcn),
              axios.get(transcriptionURL_tl),
              axios.get(transcriptionURL_tc_xml),
              axios.get(transcriptionURL_tcn_xml),
              axios.get(transcriptionURL_tl_xml),
            ]).then(axios.spread((
              tc_response,
              tcn_response,
              tl_response,
              tc_xml_response,
              tcn_xml_response,
              tl_xml_response,
            ) => {
              this.transcription = {};

              this.transcription.tc = this.parseTranscription(tc_response.data);
              if (this.transcription.tc === null) {
                reject(new Error(`Unable to parse <folio> element in ${transcriptionURL_tc}`));
              }

              this.transcription.tcn = this.parseTranscription(tcn_response.data);
              if (this.transcription.tcn.html === null) {
                reject(new Error(`Unable to parse <folio> element in ${transcriptionURL_tcn}`));
              }

              this.transcription.tl = this.parseTranscription(tl_response.data);
              if (this.transcription.tl.html === null) {
                reject(new Error(`Unable to parse <folio> element in ${transcriptionURL_tl}`));
              }

              this.transcription.tc_xml = tc_xml_response.data;
              this.transcription.tcn_xml = tcn_xml_response.data;
              this.transcription.tl_xml = tl_xml_response.data;

              this.loaded = true;
              resolve(this);
            }))
              .catch((error) => {
                reject(error);
              });
          }))
          .catch((error) => {
            reject(error);
          });

        // if there is no annotatation list, just load the image and provide a blank transcription
      } else {
        axios.get(this.image_zoom_url)
          .then((imageServerResponse) => {
            this.transcription = {
              tc: {
                layout: 'grid',
                html: '',
              },
              tcn: {
                layout: 'grid',
                html: '',
              },
              tl: {
                layout: 'grid',
                html: '',
              },
            };
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

  errorMessage(message) {
    return {
      layout: 'margin',
      html: `<div id="error"><div data-layout="middle">${message}</div></div>`,
    };
  }

  // returns transcription or error message if unable to parse
  parseTranscription(html) {
    const folioTag = '<folio';
    const openDivIndex = html.indexOf(folioTag);
    if (openDivIndex === -1) return this.errorMessage('Folio element not found.');
    const start = html.indexOf('>', openDivIndex) + 1;
    const end = html.lastIndexOf('</folio>');
    if (end === -1) return this.errorMessage('Folio element closing tag not found.');
    if (start > end) return this.errorMessage('Unable to parse folio element.');

    // detect folio mode
    const folioAttribs = html.slice(openDivIndex + folioTag.length, start - 1);
    const layoutAttr = 'layout=';
    const layoutAttrIndex = folioAttribs.indexOf(layoutAttr);
    if (layoutAttrIndex === -1) return this.errorMessage('Unable to parse layout attribute in folio element.');
    const layoutAttrStart = layoutAttrIndex + layoutAttr.length + 1;
    const layoutType = folioAttribs.slice(layoutAttrStart, folioAttribs.indexOf('"', layoutAttrStart));
    const transcription = html.slice(start, end);
    return {
      layout: layoutType,
      html: transcription,
    };
  }
}

export default Folio;
