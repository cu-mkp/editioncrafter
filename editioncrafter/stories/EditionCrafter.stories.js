import React from 'react';
import EditionCrafter from '../src/index';

const config = {
  iiifManifest: 'http://localhost:8080/fr640_3r-3v-example/iiif/manifest.json',
  documentName: 'BnF Ms. Fr. 640',
  transcriptionTypes: {
    tc: 'Diplomatic (FR)',
    tcn: 'Normalized (FR)',
    tl: 'Translation (EN)',
    test: 'Test Field (EN)',
  },
  glossaryURL: '/fr640_3r-3v-example/glossary.json',
};

export const Default = () => (
  <EditionCrafter config={config} />
);

export default {
  title: 'EditionCrafter',
};
