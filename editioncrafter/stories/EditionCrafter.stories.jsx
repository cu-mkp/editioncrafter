import React, { useEffect, useState } from 'react'
import EditionCrafter, { EntryList } from '../src/index'

export function BowInTheCloud() {
  return (
    <EditionCrafter
      documentName="eng-415-145a"
      transcriptionTypes={{
        'eng-415-145a': 'Transcription',
      }}
      iiifManifest="https://cu-mkp.github.io/bic-editioncrafter-data/eng-415-145a/iiif/manifest.json"
    />
  )
}

export function DyngleyFamily() {
  return (
    <EditionCrafter
      documentName="O.8.35"
      transcriptionTypes={{
        transcription: 'Translation',
      }}
      iiifManifest="https://cu-mkp.github.io/dyngleyfamily-editioncrafter-data/O_8_35/iiif/manifest.json"
    />
  )
}

export function NativeBoundUnbound() {
  return (
    <EditionCrafter
      documentName="FHL_007548733_TAOS_BAPTISMS_BATCH_2"
      transcriptionTypes={{
        translation: 'Translation',
        transcription: 'Transcription',
      }}
      iiifManifest="https://editioncrafter.org/taos-baptisms-example/iiif/manifest.json"
    />
  )
}

export function SimpleImages() {
  return (
    <EditionCrafter
      documentName="Simple Images"
      transcriptionTypes={{
        text: 'Translation',
      }}
      iiifManifest="/images-example/iiif/manifest.json"
    />
  )
}

export function BnFMsFr640() {
  return (
    <EditionCrafter
      documentName="BnF Ms. Fr. 640"
      transcriptionTypes={{
        tc: 'Diplomatic (FR)',
        tcn: 'Normalized (FR)',
        tl: 'Translation (EN)',
        test: 'Test Field (EN)',
      }}
      iiifManifest="https://cu-mkp.github.io/editioncrafter-data/fr640_3r-3v-example/iiif/manifest.json"
      glossaryURL="https://cu-mkp.github.io/editioncrafter-data/fr640_3r-3v-example/glossary.json"
    />
  )
}

export function IntervistePescatori() {
  return (
    <EditionCrafter
      threePanel
      documentName="Interviste Pescatori 1r-35v"
      transcriptionTypes={{
        transcription: 'Transcription',
      }}
      iiifManifest="https://cu-mkp.github.io/venice-editioncrafter-data/data/interviste-pescatori_1r-35v/iiif/manifest.json"
    />
  )
}

export function OrnamentDesignTranslation() {
  return (
    <EditionCrafter
      documentName="Ornament : Design : Translation"
      documentInfo={{
        caryatidum: {
          documentName: 'caryatidum',
          transcriptionTypes: {
            'text-1': 'Text 1',
            'text-2': 'Text 2',
          },
          iiifManifest:
          'https://cu-mkp.github.io/odt-editioncrafter-data/texts/caryatidum/iiif/manifest.json',
        },
        grotisch_fur_alle_kunstler: {
          documentName: 'grotisch_fur_alle_kunstler',
          transcriptionTypes: {
            'text-1': 'Text 1',
            'text-2': 'Text 2',
          },
          iiifManifest:
          'https://cu-mkp.github.io/odt-editioncrafter-data/texts/grotisch_fur_alle_kunstler/iiif/manifest.json',
        },
        mansches_de_coutiaus: {
          documentName: 'mansches_de_coutiaus',
          transcriptionTypes: {
            'text-1': 'Text 1',
            'text-2': 'Text 2',
          },
          iiifManifest:
          'https://cu-mkp.github.io/odt-editioncrafter-data/texts/mansches_de_coutiaus/iiif/manifest.json',
        },
        passio_verbigenae: {
          documentName: 'passio_verbigenae',
          transcriptionTypes: {
            'text-1': 'Text 1',
            'text-2': 'Text 2',
          },
          iiifManifest:
          'https://cu-mkp.github.io/odt-editioncrafter-data/texts/passio_verbigenae/iiif/manifest.json',
        },
        veelderley_veranderinghe_van_grotissen: {
          documentName: 'veelderley_veranderinghe_van_grotissen',
          transcriptionTypes: {
            'text-1': 'Text 1',
            'text-2': 'Text 2',
          },
          iiifManifest:
          'https://cu-mkp.github.io/odt-editioncrafter-data/texts/veelderley_veranderinghe_van_grotissen/iiif/manifest.json',
        },
      }}
    />
  )
}

export function SearchExample() {
  return (
    <EntryList />
  )
}

export function embeddedDiv() {
  return (
    <div
      style={{
        width: '1200px',
        height: '600px',
        margin: '0 auto',
        fontSize: '9px',
      }}
    >
      <EditionCrafter
        documentName="FHL_007548733_TAOS_BAPTISMS_BATCH_2"
        transcriptionTypes={{
          translation: 'Translation',
          transcription: 'Transcription',
        }}
        iiifManifest="https://editioncrafter.org/taos-baptisms-example/iiif/manifest.json"
      />
    </div>
  )
}

export function fullScreen() {
  return (
    <div style={{ width: '100dvw', height: '100dvh' }}>
      <EditionCrafter
        documentName="FHL_007548733_TAOS_BAPTISMS_BATCH_2"
        transcriptionTypes={{
          translation: 'Translation',
          transcription: 'Transcription',
        }}
        iiifManifest="https://editioncrafter.org/taos-baptisms-example/iiif/manifest.json"
      />
    </div>
  )
}

export function stateChange() {
  const [manifest] = useState(
    'https://editioncrafter.org/taos-baptisms-example/iiif/manifest.json',
  )
  const [glossary, setGlossary] = useState(undefined)
  const [title, setTitle] = useState('FHL_007548733_TAOS_BAPTISMS_BATCH_2')

  useEffect(() => {
    setTimeout(() => {
      // setManifest('https://cu-mkp.github.io/dyngleyfamily-editioncrafter-data/O_8_35/iiif/manifest.json');
      setGlossary(
        'https://cu-mkp.github.io/editioncrafter-data/fr640_3r-3v-example/glossary.json',
      )
      setTitle('Taos Baptisms Batch 2')
    }, 10000)
  }, [])

  return (
    <EditionCrafter
      documentName={title}
      transcriptionTypes={{
        translation: 'Translation',
        transcription: 'Transcription',
      }}
      iiifManifest={manifest}
      glossaryURL={glossary}
    />
  )
}

export default {
  title: 'EditionCrafter',
}
