import { useMemo, useState } from 'react'
import { Button, ButtonGroup, Divider, Drawer, IconButton, Typography } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import GridOnIcon from '@material-ui/icons/GridOn'
import ListIcon from '@material-ui/icons/List'
import TuneIcon from '@material-ui/icons/Tune'
import {
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom'

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

function getInitialSelection(documents) {
    // set EC to initial state?
    return {
        left: {
            documentID: 1,
            surfaceID: 1,
        },
        right: {
            documentID: 1,
            surfaceID: 1,
        }
    }
}

function SurfaceBrowser(props) {
    const { db, open, toggleOpen } = props
    const documents = useMemo(() => getData(db), [db])
    const [selection, setSelection] = useState(getInitialSelection(documents))
    const [pageCount, setPageCount] = useState(0)
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()

    const {
        folioID,
        transcriptionType,
        folioID2,
        transcriptionType2,
      } = params

    const onSelection = (nextSelection) => {
        // tell EC to adjust via routes
        const navParams = `/ec/${document1}_${folioID}/f/${document2}_${folioID2}/f`
        navigate(navParams + location.search)
        setSelection(nextSelection)
    }
        
    const documentDetails = documents.map( doc => {
        return (
            <DocumentDetail 
                key={`document-detail-${doc.id}`} 
                db={db} 
                documentName={doc.name} 
                documentID={doc.id}
                selection={selection}
                onSelection={onSelection}
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