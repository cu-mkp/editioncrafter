import React from 'react';
import EditionCrafter from '../src/index';

const baseConfig = {
  documentName: 'BnF Ms. Fr. 640',
  transcriptionTypes: {
    tc: 'Diplomatic (FR)',
    tcn: 'Normalized (FR)',
    tl: 'Translation (EN)',
    test: 'Test Field (EN)',
  },
};

export const Development = () => (
  <EditionCrafter config={{
    ...baseConfig,
    iiifManifest: 'http://localhost:8080/fr640_3r-3v-example/iiif/manifest.json'
  }}
  />
);

export const Testing = () => (
  <EditionCrafter config={{
    ...baseConfig,
    iiifManifest: 'https://cu-mkp.github.io/editioncrafter-data/fr640_3r-3v-example/iiif/manifest.json'
  }}
  />
);

export default {
  title: 'EditionCrafter',
};
