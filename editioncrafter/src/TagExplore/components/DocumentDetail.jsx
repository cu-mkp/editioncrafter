import { useMemo } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { getObjs } from '../../common/lib/sql'

const MAX_THUMBNAIL_DIMENSION = 130

function getData(db,docID) {
    const surfaceStmt = db.prepare(`
      SELECT
        surfaces.id AS id,
        surfaces.name AS name,
        surfaces.width AS width,
        surfaces.height AS height,
        surfaces.image_type AS image_type,
        surfaces.image_url AS image_url,
        surfaces.position AS position
      FROM
        surfaces
      WHERE
        document_id=${docID}
      ORDER BY
        position
    `)
  
    // add thumbnail URLs
    const surfaces = getObjs(surfaceStmt)
    for( const surface of surfaces ) {
        surface.thumbnail_url = getThumbnailURL(surface)
    }

    return surfaces
  }
  
  function getThumbnailURL( surface ) {
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
      const { surfaceID, name, imageURL, thumbnailURL, onClick } = props
  
      const onError = (currentTarget) => {
          currentTarget.onerror = null; 
          const fullImageURL = `${imageURL.slice(0, -9)}full/full/0/default.jpg`
          if (currentTarget.src !== fullImageURL) {
              currentTarget.src = fullImageURL
          } 
      }
  
      return (
          <li className="surface-thumbnail">
              <figure>
                  <a id={surfaceID} onClick={onClick.bind(this, surfaceID)}>
                      <img 
                          src={thumbnailURL} 
                          alt={name} 
                          style={{ maxWidth: `${MAX_THUMBNAIL_DIMENSION}px`, maxHeight: `${MAX_THUMBNAIL_DIMENSION}px` }} 
                          onError={onError}
                      ></img>
                  </a>
              </figure>
              <figcaption className="surface-thumbnail-caption">
                  {name}
              </figcaption>
        </li>
      )
  }
  
  function ThumbnailGrid(props) {
      const { surfaces, selection, navigateToSelection } = props
  
      const onClickThumb = () => {

        // TODO
        navigateToSelection({

        })
      }
  
    return (
        <ul>
            {
                surfaces.map(surface => 
                    <Thumbnail
                        key={`doc-detail-thumb-${surface.id}`}
                        surfaceID={surface.id}
                        name={surface.name}
                        imageURL={surface.image_url}
                        thumbnailURL={surface.thumbnail_url}
                        onClick={onClickThumb}
                    ></Thumbnail>
                )
            }
        </ul>
    )
}

function DocumentDetail(props) {
    const { db, documentName, documentID } = props
    const surfaces = useMemo(() => getData(db,documentID), [db])
    
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`document-detail-${documentID}-content`}
                id={`document-detail-${documentID}`}
            >
                <Typography>{documentName}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <ThumbnailGrid
                    surfaces={surfaces}
                ></ThumbnailGrid>
            </AccordionDetails>
        </Accordion>
    )
}

export default DocumentDetail