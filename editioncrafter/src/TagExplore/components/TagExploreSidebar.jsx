import HelpPopper from '../../EditionCrafter/component/HelpPopper'
import React, { useRef, useState } from 'react'

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

  return (
    <div className="tag-explore-sidebar">
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
    </div>
  )
}

export default TagExploreSidebar
