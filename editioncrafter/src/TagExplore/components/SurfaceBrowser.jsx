import { Button, ButtonGroup, Divider, Drawer, IconButton, Typography } from '@material-ui/core'
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import GridOnIcon from '@material-ui/icons/GridOn'
import ListIcon from '@material-ui/icons/List'
import TuneIcon from '@material-ui/icons/Tune'

const MAX_THUMBNAIL_DIMENSION = 130

function getData(db) {
  const tagsStmt = db.prepare(`
    SELECT
      tags.id AS id,
      tags.name AS name,
      tags.xml_id AS xml_id
    FROM
      tags
    INNER JOIN taggings
      ON taggings.tag_id = tags.id
    INNER JOIN elements
      ON elements.id = taggings.element_id
    WHERE
      elements.type = 'zone'
    GROUP BY
      tags.xml_id`)

  return {
    tags: getObjs(tagsStmt),
    taxonomies: getObjs(taxonomiesStmt),
  }
}

function getThumbnailURL( imageType, width, height, imageURL) {
    
    const ratio = canvas.width / canvas.height

    let thumbnailDimensions = []
    if (ratio > 1) {
      thumbnailDimensions = [MAX_THUMBNAIL_DIMENSION, Math.round(MAX_THUMBNAIL_DIMENSION / ratio)]
    }
    else {
      thumbnailDimensions = [Math.round(MAX_THUMBNAIL_DIMENSION * ratio), MAX_THUMBNAIL_DIMENSION]
    }

    const thumbnailURL = imageType === 'iiif'
      ? `${imageURL}/full/${thumbnailDimensions.join(',')}/0/default.jpg`
      : imageURL

    return thumbnailURL
}

// doc
// name, surfaces
// surface
// id, name, imageURL, imageThumbURL

function Thumbnail(props) {
    const { surface, onClick } = props
    const { id, name, imageURL, thumbnailURL } = surface

    const onError = (currentTarget) => {
        currentTarget.onerror = null; 
        const fullImageURL = `${imageURL.slice(0, -9)}full/full/0/default.jpg`
        if (currentTarget.src !== fullImageURL) {
            currentTarget.src = fullImageURL
        } 
    }

    return (
        <li key={`thumb-${index}`} className="thumbnail">
            <figure>
                <a id={id} onClick={onClick.bind(this, id)}>
                    <img 
                        src={thumbnailURL} 
                        alt={name} 
                        style={{ maxWidth: `${MAX_THUMBNAIL_DIMENSION}px`, maxHeight: `${MAX_THUMBNAIL_DIMENSION}px` }} 
                        onError={onError}
                    ></img>
                </a>
            </figure>
            <figcaption className="thumbnail-caption">
                {name}
            </figcaption>
      </li>
    )
}

function ThumbnailGrid(props) {
    const { surfaces } = props

    const onClickThumb = () => {
        console.log('click')
    }

    return surfaces.map(surface => <Thumbnail
            surface={surface}
            onClick={onClickThumb}
        ></Thumbnail>)
}

function DocumentDetail(props) {
    const { doc } = props
    const { name, surfaces } = doc
    
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>{name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <ThumbnailGrid
                    surfaces={surfaces}
                ></ThumbnailGrid>
            </AccordionDetails>
        </Accordion>
    )
}

function SurfaceBrowser(props) {
    const { db, open, toggleOpen } = props
    const documents = useMemo(() => getData(db), [db])
    
    const documentDetails = documents.map( doc => {
        return <DocumentDetail doc={doc}></DocumentDetail>
    })

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
        >
            <IconButton onClick={toggleOpen}>
                <ChevronLeftIcon />
            </IconButton>
            <Divider></Divider>
            <Typography>Contents</Typography>
            <Button
                startIcon={<TuneIcon />}
            >Filter</Button>
            <Typography>56 Pages</Typography>
            <ButtonGroup color="primary" aria-label="outlined primary button group">
                <IconButton aria-label="grid">
                    <GridOnIcon></GridOnIcon>
                </IconButton>
                <IconButton aria-label="list">
                    <ListIcon></ListIcon>
                </IconButton>
            </ButtonGroup>
            { documentDetails }
        </Drawer>
    )
}

export default SurfaceBrowser