import { Button, ButtonGroup, Divider, Drawer, IconButton, Typography } from '@material-ui/core'
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import GridOnIcon from '@material-ui/icons/GridOn'
import ListIcon from '@material-ui/icons/List'
import TuneIcon from '@material-ui/icons/Tune'

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

function Thumbnail(props) {
    const { onClickThumb, folio, width, height } = props

    const onError = (currentTarget) => {
        currentTarget.onerror = null; 
        if (folio.image_zoom_url && currentTarget.src !== `${folio.image_zoom_url.slice(0, -9)}full/full/0/default.jpg`) {
            currentTarget.src = `${folio.image_zoom_url.slice(0, -9)}full/full/0/default.jpg` 
        } 
    }

    return (
        <li key={`thumb-${index}`} className="thumbnail">
            <figure>
                <a id={folio.id} onClick={onClickThumb.bind(this, folio.id)}>
                    <img 
                        src={folio.image_thumbnail_url} 
                        alt={folio.name} 
                        style={{ maxWidth: `${width}px`, maxHeight: `${height}px` }} 
                        onError={onError}
                    ></img>
                </a>
            </figure>
            <figcaption className="thumbnail-caption">
                {folio.name}
            </figcaption>
      </li>
    )
}

function ThumbnailGrid(props) {

    return folios.map((folio, index) => <Thumbnail
            surfaceID={surfaceID}
            name={surfaceName}
            imageURL={imageURL}
            width={130}
            height={130}
        ></Thumbnail>)
}

function DocumentDetail(props) {
    const { doc } = props
    
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>Caryatidum 57</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <ThumbnailGrid></ThumbnailGrid>
            </AccordionDetails>
        </Accordion>
    )
}

function SurfaceBrowser(props) {
    const { db, open, toggleOpen } = props
    const documents = useMemo(() => getData(db), [db])
    
    const documentDetails = []
    for( const doc of documents ) {
        documentDetails.push( <DocumentDetail doc={doc}></DocumentDetail>)
    }

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