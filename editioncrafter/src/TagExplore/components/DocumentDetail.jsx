import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useEffect, useMemo } from 'react'
import { getObjs } from '../../common/lib/sql'
import InsertLeft from '../assets/InsertLeft'
import InsertRight from '../assets/InsertRight'
import Left from '../assets/Left'
import Right from '../assets/Right'

const MAX_THUMBNAIL_DIMENSION = 100

function getData(db, docID, tags = []) {
  const surfaceStmt = db.prepare(`
      SELECT
        surfaces.id AS id,
        surfaces.name AS name,
        surfaces.xml_id AS xml_id,
        surfaces.width AS width,
        surfaces.height AS height,
        surfaces.image_type AS image_type,
        surfaces.image_url AS image_url,
        surfaces.position AS position
      FROM
        surfaces
      LEFT JOIN
        elements
      ON
        surfaces.id = elements.surface_id
      LEFT JOIN
        taggings
      ON
        elements.id = taggings.element_id
      WHERE
        document_id=${docID}${tags.length ? ` AND taggings.tag_id IN (${tags.join(',')})` : ''} 
      GROUP BY
        surfaces.id
      ORDER BY
        position
    `)

  // add thumbnail URLs
  const surfaces = getObjs(surfaceStmt)
  for (const surface of surfaces) {
    surface.thumbnail_url = getThumbnailURL(surface)
  }

  return surfaces
}

function getThumbnailURL(surface) {
  const { image_url, width, height, image_type } = surface

  const ratio = height !== 0 ? width / height : 0

  let thumbnailDimensions = []
  if (ratio > 1) {
    thumbnailDimensions = [MAX_THUMBNAIL_DIMENSION, Math.round(MAX_THUMBNAIL_DIMENSION / ratio)]
  }
  else {
    thumbnailDimensions = [Math.round(MAX_THUMBNAIL_DIMENSION * ratio), MAX_THUMBNAIL_DIMENSION]
  }

  const thumbnailURL = image_type === 'iiif'
    ? `${image_url}/full/${thumbnailDimensions.join(',')}/0/default.jpg`
    : image_url

  return thumbnailURL
}

function Thumbnail(props) {
  const { surfaceID, name, imageURL, thumbnailURL, onClick, selection, info } = props

  const isLeft = useMemo(() => (selection && selection?.left?.localID === info?.localID && selection?.left?.surfaceID === info?.surfaceID), [selection, info])
  const isRight = useMemo(() => (selection && selection?.right?.localID === info?.localID && selection?.right?.surfaceID === info?.surfaceID), [selection, info])

  const onError = (currentTarget) => {
    currentTarget.onerror = null
    const fullImageURL = `${imageURL.slice(0, -9)}full/full/0/default.jpg`
    if (currentTarget.src !== fullImageURL) {
      currentTarget.src = fullImageURL
    }
  }

  return (
    <Grid className="surface-thumbnail">
      <figure className="surface-thumbnail-figure">
        {isLeft
          ? (
              <div className="surface-thumbnail-overlay-selected left">
                <div>
                  <Left />
                  <Typography>Left</Typography>
                </div>
              </div>
            )
          : isRight
            ? (
                <div className="surface-thumbnail-overlay-selected right">
                  <div>
                    <Right />
                    <Typography>Right</Typography>
                  </div>
                </div>
              )
            : (
                <div className="surface-thumbnail-overlay">
                  <div className="surface-thumbnail-overlay-content">
                    <a onClick={onClick.left} title="Insert left"><InsertLeft /></a>
                    <a onClick={onClick.right} title="Insert right"><InsertRight /></a>
                  </div>
                </div>
              )}
        <div id={surfaceID}>
          <img
            src={thumbnailURL}
            alt={name}
            style={{ maxWidth: `${MAX_THUMBNAIL_DIMENSION}px`, maxHeight: `${MAX_THUMBNAIL_DIMENSION}px` }}
            onError={onError}
          />
        </div>
      </figure>
      <figcaption className="surface-thumbnail-caption">
        {name}
      </figcaption>
    </Grid>
  )
}

function ThumbnailGrid(props) {
  const { surfaces, selection, navigateToSelection, documentLocalID } = props

  return (
    <Grid className="thumbnail-grid" container>
      {
        surfaces.map(surface => (
          <Thumbnail
            key={`doc-detail-thumb-${surface.id}`}
            surfaceID={surface.id}
            name={surface.name}
            imageURL={surface.image_url}
            thumbnailURL={surface.thumbnail_url}
            selection={selection}
            info={{
              localID: documentLocalID,
              surfaceID: surface.xml_id,
            }}
            onClick={{
              left: (e) => {
                e.preventDefault()
                navigateToSelection({
                  left: {
                    localID: documentLocalID,
                    surfaceID: surface.xml_id,
                  },
                  right: selection.right,
                })
              },
              right: (e) => {
                e.preventDefault()
                navigateToSelection({
                  left: selection.left,
                  right: {
                    localID: documentLocalID,
                    surfaceID: surface.xml_id,
                  },
                })
              },
            }}
          >
          </Thumbnail>
        ),
        )
      }
    </Grid>
  )
}

function DocumentDetail(props) {
  const { db, documentName, documentID, documentLocalID, navigateToSelection, updatePageCount, selection, tags } = props
  const surfaces = useMemo(() => getData(db, documentID, tags), [db, documentID, tags])

  useEffect(() => {
    updatePageCount(surfaces?.length)
  }, [surfaces, updatePageCount, tags])

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`document-detail-${documentID}-content`}
        id={`document-detail-${documentID}`}
        className="accordion-summary"
      >
        <Typography>{documentName}</Typography>
        <Typography>{surfaces?.length || ''}</Typography>
      </AccordionSummary>
      <AccordionDetails
        className="accordion-detail"
      >
        <ThumbnailGrid
          navigateToSelection={navigateToSelection}
          documentLocalID={documentLocalID}
          surfaces={surfaces}
          selection={selection}
        >
        </ThumbnailGrid>
      </AccordionDetails>
    </Accordion>
  )
}

export default DocumentDetail
