import { useMemo } from 'react'
import { Button, ButtonGroup, Divider, Drawer, IconButton, Typography } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import GridOnIcon from '@material-ui/icons/GridOn'
import ListIcon from '@material-ui/icons/List'
import TuneIcon from '@material-ui/icons/Tune'
import DocumentDetail from './DocumentDetail'
import { getObjs } from '../../common/lib/sql'

function getData(db) {
    const docStmt = db.prepare(`
      SELECT
        documents.id AS id,
        documents.name AS name
      FROM
        documents
    `)
  
    return getObjs(docStmt)  
}

function SurfaceBrowser(props) {
    const { db, open, toggleOpen } = props
    const documents = useMemo(() => getData(db), [db])
    
    const documentDetails = documents.map( doc => {
        return <DocumentDetail key={`document-detail-${doc.id}`} db={db} documentName={doc.name} documentID={doc.id}></DocumentDetail>
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
            <Typography>{documents.length} Documents</Typography>
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