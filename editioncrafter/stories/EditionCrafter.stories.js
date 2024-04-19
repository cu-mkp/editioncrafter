import React from 'react';
import EditionCrafter from '../src/index';

export const BowInTheCloud = () => (
  <EditionCrafter
    documentName='eng-415-145a'
    transcriptionTypes={{
      'eng-415-145a': 'Transcription'
    }}
    iiifManifest='https://cu-mkp.github.io/bic-editioncrafter-data/eng-415-145a/iiif/manifest.json'
  />
);

export const DyngleyFamily = () => (
  <EditionCrafter
    documentName='O.8.35'
    transcriptionTypes={{
      transcription: 'Translation',
    }}
    iiifManifest='https://cu-mkp.github.io/dyngleyfamily-editioncrafter-data/O_8_35/iiif/manifest.json'
  />
);

export const NativeBoundUnbound = () => (
  <EditionCrafter
    documentName='FHL_007548733_TAOS_BAPTISMS_BATCH_2'
    transcriptionTypes={{
      translation: 'Translation',
      transcription: 'Transcription',
    }}
    iiifManifest='https://cu-mkp.github.io/editioncrafter/taos-baptisms-example/iiif/manifest.json'
  />
);

export const BnFMsFr640 = () => (
  <EditionCrafter
    documentName='BnF Ms. Fr. 640'
    transcriptionTypes={{
      tc: 'Diplomatic (FR)',
      tcn: 'Normalized (FR)',
      tl: 'Translation (EN)',
      test: 'Test Field (EN)',
    }}
    iiifManifest='https://cu-mkp.github.io/editioncrafter-data/fr640_3r-3v-example/iiif/manifest.json'
    glossaryURL='https://cu-mkp.github.io/editioncrafter-data/fr640_3r-3v-example/glossary.json'
  />
);

export const IntervistePescatori = () => (
  <EditionCrafter
    threePanel
    documentName='Interviste Pescatori 1r-35v'
    transcriptionTypes={{
      transcription: 'Transcription'
    }}
    iiifManifest='https://cu-mkp.github.io/venice-editioncrafter-data/data/interviste-pescatori_1r-35v/iiif/manifest.json'
  />
);

export const MultiDocument = () => (
  <EditionCrafter
    documentName='FHL_007548733_TAOS_BAPTISMS_BATCH_2 and eng-415-145a'
    threePanel
    documentInfo={{
      FHL_007548733_TAOS_BAPTISMS_BATCH_2: {
        documentName: 'Taos Baptisms Batch 2',
        transcriptionTypes: {
          translation: 'Translation',
          transcription: 'Transcription',
        },
        iiifManifest: 'https://cu-mkp.github.io/editioncrafter/taos-baptisms-example/iiif/manifest.json',
      },
      eng_415_145a: {
        documentName: 'Eng 415-145a',
        transcriptionTypes: {
          'eng-415-145a': 'Transcription',
        },
        iiifManifest: 'https://cu-mkp.github.io/bic-editioncrafter-data/eng-415-145a/iiif/manifest.json',
      },
    }}
  />
);

export const embeddedDiv = () => (
  <div style={{ width: '1200px', height: '600px', margin: '0 auto', fontSize: '9px' }}>
    <EditionCrafter
      documentName='FHL_007548733_TAOS_BAPTISMS_BATCH_2'
      transcriptionTypes={{
        translation: 'Translation',
        transcription: 'Transcription',
      }}
      iiifManifest='https://cu-mkp.github.io/editioncrafter/taos-baptisms-example/iiif/manifest.json'
    />
  </div>
)

export const fullScreen = () => (
  <div style={{ width: '100dvw', height: '100dvh' }}>
    <EditionCrafter
      documentName='FHL_007548733_TAOS_BAPTISMS_BATCH_2'
      transcriptionTypes={{
        translation: 'Translation',
        transcription: 'Transcription',
      }}
      iiifManifest='https://cu-mkp.github.io/editioncrafter/taos-baptisms-example/iiif/manifest.json'
    />
  </div>
)

export default {
  title: 'EditionCrafter',
};
