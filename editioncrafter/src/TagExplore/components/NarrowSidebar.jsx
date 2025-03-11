import {
    FaQuestionCircle
} from 'react-icons/fa'  

import { BsFillGrid3X3GapFill } from 'react-icons/bs'
import { List, ListItem, ListItemIcon } from '@material-ui/core'

function NarrowSidebar(props) {
    const { helpRef, toggleDrawer, toggleHelp } = props
    return (
        <div className="narrow-sidebar">
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
        </div>
    )
}

export default NarrowSidebar