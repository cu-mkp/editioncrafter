import React from 'react';
import EditionCrafter from '../src/index';

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
    documentName: 'FHL_007548733_TAOS_BAPTISMS_BATCH_2',
    transcriptionTypes: {
      translation: 'Translation',
    },
    iiifManifest: 'https://cu-mkp.github.io/editioncrafter-data/taos-baptisms-example/iiif/manifest.json',
  }}
  />
);

export default {
  title: 'EditionCrafter',
};
