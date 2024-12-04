import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

function CollapsibleMenu(props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="collapsible-menu">
        <button className="collapsible-menu-toggle" onClick={() => setOpen(!open)} type="button">
          <p className="collapsible-menu-title">{props.title}</p>
          {open
            ? <FaChevronUp />
            : <FaChevronDown />}
        </button>
      </div>
      {open && props.children}
    </>
  )
}

export default CollapsibleMenu
