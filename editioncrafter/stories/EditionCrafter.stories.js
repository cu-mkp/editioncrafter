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

export const OrnamentDesignTranslation = () => (
  <EditionCrafter
    documentName='Ornament : Design : Translation'
    documentInfo={{
      caryatidum: {
        documentName: 'caryatidum',
        transcriptionTypes: {
          'text-1': 'Text 1',
          'text-2': 'Text 2',
        },
        iiifManifest: 'https://cu-mkp.github.io/odt-editioncrafter-data/texts/caryatidum/iiif/manifest.json',
      },
      grotisch_fur_alle_kunstler: {
        documentName: 'grotisch_fur_alle_kunstler',
        transcriptionTypes: {
          'text-1': 'Text 1',
          'text-2': 'Text 2',
        },
        iiifManifest: 'https://cu-mkp.github.io/odt-editioncrafter-data/texts/grotisch_fur_alle_kunstler/iiif/manifest.json',
      },
      mansches_de_coutiaus: {
        documentName: 'mansches_de_coutiaus',
        transcriptionTypes: {
          'text-1': 'Text 1',
          'text-2': 'Text 2',
        },
        iiifManifest: 'https://cu-mkp.github.io/odt-editioncrafter-data/texts/mansches_de_coutiaus/iiif/manifest.json',
      },
      passio_verbigenae: {
        documentName: 'passio_verbigenae',
        transcriptionTypes: {
          'text-1': 'Text 1',
          'text-2': 'Text 2',
        },
        iiifManifest: 'https://cu-mkp.github.io/odt-editioncrafter-data/texts/passio_verbigenae/iiif/manifest.json',
      },
      veelderley_veranderinghe_van_grotissen: {
        documentName: 'veelderley_veranderinghe_van_grotissen',
        transcriptionTypes: {
          'text-1': 'Text 1',
          'text-2': 'Text 2',
        },
        iiifManifest: 'https://cu-mkp.github.io/odt-editioncrafter-data/texts/veelderley_veranderinghe_van_grotissen/iiif/manifest.json',
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
