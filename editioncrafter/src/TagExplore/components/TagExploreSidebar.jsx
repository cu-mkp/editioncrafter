import {
    FaQuestionCircle
} from 'react-icons/fa'  
import HelpPopper from '../../EditionCrafter/component/HelpPopper'
import React, { useRef, useState } from 'react'
import { BsFillGrid3X3GapFill } from 'react-icons/bs'
import { Button, ButtonGroup, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, Typography } from '@material-ui/core'
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import GridOnIcon from '@material-ui/icons/GridOn'
import ListIcon from '@material-ui/icons/List'
import TuneIcon from '@material-ui/icons/Tune'

function NarrowSidebar(props) {
    const { helpRef, toggleDrawer, toggleHelp } = props
    return (
        <List>
            <ListItem 
                onClick={toggleDrawer}
                button
            >
                <ListItemIcon>
                    <BsFillGrid3X3GapFill />
                </ListItemIcon>
            </ListItem>
            <ListItem
                onClick={toggleHelp}
                ref={helpRef}
                button
            >
                <ListItemIcon>
                    <FaQuestionCircle />
                </ListItemIcon>
            </ListItem>
        </List>
    )
}

function PageBrowsingDrawer(props) {
    const { openDrawer, toggleDrawer } = props
    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={openDrawer}
        >
            <IconButton onClick={toggleDrawer}>
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
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Caryatidum 57</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Drawer>
    )
}

function TagExploreSidebar(props) {
  const [openHelp, setOpenHelp] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)

    const toggleHelp = () => {
        setOpenHelp(!openHelp)
    }

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer)
    }

    const helpRef = useRef(null)
    const helpMarginStyle = { marginRight: '55px' } 

  return (
    <div className="tag-explore-sidebar">
        <NarrowSidebar
            toggleDrawer={toggleDrawer}
            toggleHelp={toggleHelp}
            helpRef={helpRef}
        ></NarrowSidebar>
        <PageBrowsingDrawer
            openDrawer={openDrawer}
            toggleDrawer={toggleDrawer}
        ></PageBrowsingDrawer>
        <HelpPopper
            marginStyle={helpMarginStyle}
            anchorEl={helpRef.current}
            open={openHelp}
            onClose={toggleHelp}
        />
    </div>
  )
}

export default TagExploreSidebar
