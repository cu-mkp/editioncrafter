import React, { useRef, useState } from 'react'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'

import HelpPopper from '../../EditionCrafter/component/HelpPopper'
import NarrowSidebar from './NarrowSidebar'
import SurfaceBrowser from './SurfaceBrowser'

function TagExploreSidebar(props) {
    const { db } = props
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
    const theme = createTheme({
        palette: {
          type: 'dark',
        },
    })

  return (
    <div className="tag-explore-sidebar">
         <ThemeProvider theme={theme}>
            <NarrowSidebar
                toggleDrawer={toggleDrawer}
                toggleHelp={toggleHelp}
                helpRef={helpRef}
            ></NarrowSidebar>
            <SurfaceBrowser
                db={db}
                open={openDrawer}
                toggleOpen={toggleDrawer}
            ></SurfaceBrowser>
            <HelpPopper
                marginStyle={helpMarginStyle}
                anchorEl={helpRef.current}
                open={openHelp}
                onClose={toggleHelp}
            />
         </ThemeProvider>
    </div>
  )
}

export default TagExploreSidebar
