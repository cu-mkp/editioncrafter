import React from 'react';
import EditionCrafter from '../src/index';

export const Development = () => (
  <EditionCrafter config={{
    documentName: 'FHL_007548733_TAOS_BAPTISMS_BATCH_2',
    transcriptionTypes: {
      translation: 'Translation',
      transcription: 'Transcription',
    },
    iiifManifest: 'http://localhost:8080/FHL_007548733_TAOS_BAPTISMS_BATCH_2/iiif/manifest.json',
  }}
  />
);

export const TestingTaos = () => (
  <EditionCrafter config={{
    documentName: 'FHL_007548733_TAOS_BAPTISMS_BATCH_2',
    transcriptionTypes: {
      translation: 'Translation',
      transcription: 'Transcription',
    },
    iiifManifest: 'https://cu-mkp.github.io/editioncrafter/taos-baptisms-example/iiif/manifest.json',
  }}
  />
);

export const TestingFr640 = () => (
  <EditionCrafter config={{
    documentName: 'BnF Ms. Fr. 640',
    transcriptionTypes: {
      tc: 'Diplomatic (FR)',
      tcn: 'Normalized (FR)',
      tl: 'Translation (EN)',
      test: 'Test Field (EN)',
    },
    iiifManifest: 'https://cu-mkp.github.io/editioncrafter-data/fr640_3r-3v-example/iiif/manifest.json',
  }}
  />
);

export default {
  title: 'EditionCrafter',
};
