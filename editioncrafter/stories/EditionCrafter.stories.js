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
    documentName: 'FHL_007548733_TAOS_BAPTISMS_BATCH_2',
    transcriptionTypes: {
      translation: 'Translation',
    },
    iiifManifest: 'http://localhost:8080/FHL_007548733_TAOS_BAPTISMS_BATCH_2/iiif/manifest.json',
  }}
  />
);

export const Testing = () => (
  <EditionCrafter config={{
    ...baseConfig,
    iiifManifest: 'https://cu-mkp.github.io/editioncrafter-data/fr640_3r-3v-example/iiif/manifest.json',
  }}
  />
);

export default {
  title: 'EditionCrafter',
};
