import React from 'react';
import EditionCrafter from '../src/index';

export const BowInTheCloud = () => (
  <EditionCrafter config={{
    documentName: 'eng-415-145a',
    transcriptionTypes: {
      'eng-415-145a': 'Transcription'
    },
    iiifManifest: 'https://cu-mkp.github.io/bic-editioncrafter-data/eng-415-145a/iiif/manifest.json',
  }}
  />
);

export const DyngleyFamily = () => (
  <EditionCrafter config={{
    documentName: 'O.8.35',
    transcriptionTypes: {
      transcription: 'Translation',
    },
    iiifManifest: 'https://cu-mkp.github.io/dyngleyfamily-editioncrafter-data/O_8_35/iiif/manifest.json',
  }}
  />
);

export const NativeBoundUnbound = () => (
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

export const BnFMsFr640 = () => (
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

export const IntervistePescatori = () => (
  <EditionCrafter config={{
    documentName: 'Interviste Pescatori 1r-35v',
    transcriptionTypes: {
      transcription: 'Transcription'
    },
    iiifManifest: 'https://cu-mkp.github.io/venice-editioncrafter-data/data/interviste-pescatori_1r-35v/iiif/manifest.json',
  }}
  />
);

export default {
  title: 'EditionCrafter',
};
