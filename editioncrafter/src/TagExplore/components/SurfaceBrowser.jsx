import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
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
        documents.name AS name,
        documents.local_id AS local_id
      FROM
        documents
    `)
  
    return getObjs(docStmt)  
}

function parseFolioID(folioID) {
    if( !folioID ) {
        return null
    }
    const parts = folioID.split('_')
    const localID = parts.slice(0,parts.length-1).join('_')
    const surfaceID = parts[parts.length-1]
    
    return {
        localID,
        surfaceID
    }
}

function getSelection(params) {
    const { folioID, folioID2 } = params
    const left = parseFolioID(folioID)
    const right = parseFolioID(folioID2)
    return { left, right }
}

function SurfaceBrowser(props) {
    const { db, open, toggleOpen } = props
    const documents = useMemo(() => getData(db), [db])
    const [pageCount, setPageCount] = useState(0)

    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()
    const selection = getSelection(params)

    const navigateToSelection = (nextSelection) => {
        const folioID = `${nextSelection.left.localID}_${nextSelection.left.surfaceID}`
        const folioID2 = `${nextSelection.right.localID}_${nextSelection.right.surfaceID}`
        const navParams = `/ec/${folioID}/f/${folioID2}/f`
        // TODO is this the right fn?
        navigate(navParams + location.search)
    }
        
    const documentDetails = documents.map( doc => {
        return (
            <DocumentDetail 
                key={`document-detail-${doc.id}`} 
                db={db} 
                documentID={doc.id}
                documentLocalID={doc.local_id}
                documentName={doc.name} 
                selection={selection}
                navigateToSelection={navigateToSelection}
            ></DocumentDetail>
        )
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
            <Typography>{pageCount} Page{ pageCount != 1 ? 's' : ''}</Typography>
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