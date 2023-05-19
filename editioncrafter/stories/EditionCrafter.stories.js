import React from 'react';
import EditionCrafter from '../src/index';

import './assets/editioncrafter.css';

const config = {
  iiifManifest: 'http://localhost:8080/fr640_3r-3v-example/iiif/manifest.json',
  documentName: 'BnF Ms. Fr. 640',
  transcriptionTypes: {
    tc: 'Diplomatic (FR)',
    tcn: 'Normalized (FR)',
    tl: 'Translation (EN)',
  },
  commentsURL: '/fr640_3r-3v-example/comments.json',
  glossaryURL: '/fr640_3r-3v-example/glossary.json',
};

export const Default = () => (
  <EditionCrafter config={config} />
);

export default {
  title: 'EditionCrafter',
};
