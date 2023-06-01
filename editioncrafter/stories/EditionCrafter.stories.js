import React from 'react';
import EditionCrafter from '../src/index';

const baseConfig = {
  documentName: 'BnF Ms. Fr. 640',
  transcriptionTypes: {
    tc: 'Diplomatic (FR)',
    tcn: 'Normalized (FR)',
    tl: 'Translation (EN)',
  },
};

export const Development = () => (
  <EditionCrafter config={{
    ...baseConfig,
    iiifManifest: 'http://localhost:8080/fr640_3r-3v-example/iiif/manifest.json',
    commentsURL: '/fr640_3r-3v-example/comments.json',
    glossaryURL: '/fr640_3r-3v-example/glossary.json',
  }}
  />
);

export const Testing = () => (
  <EditionCrafter config={{
    ...baseConfig,
    iiifManifest: 'https://cu-mkp.github.io/editioncrafter-project/fr640_3r-3v-example/iiif/manifest.json',
    commentsURL: 'https://cu-mkp.github.io/editioncrafter-project/fr640_3r-3v-example/comments.json',
    glossaryURL: 'https://cu-mkp.github.io/editioncrafter-project/fr640_3r-3v-example/glossary.json',
  }}
  />
);

export default {
  title: 'EditionCrafter',
};
