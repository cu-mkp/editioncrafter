import { Popover } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'

function JumpToFolio(props) {
  const [textInput, setTextInput] = useState('')

  const open = Boolean(props.anchorEl)
  const id = open ? `${props.side}_jumpInput` : undefined

  const handleSubmit = (event) => {
    // Consume the event
    event.preventDefault()

    // Parse out the target
    const data = new FormData(event.target)
    const folioID = data.get('folioID')

    // Submit the request
    props.submitHandler(folioID, props.side)

    // Hide and clear
    props.blurHandler()
    setTextInput('')
  }

  const handleChange = (event) => {
    setTextInput(event.target.value)
  }

  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef, open])

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={props.anchorEl}
      onClose={props.blurHandler}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          id={id}
          name="folioID"
          onBlur={props.blurHandler}
          onChange={handleChange}
          placeholder="Page Name (e.g. '3r')"
          ref={inputRef}
          type="text"
          value={textInput}
        />
      </form>
    </Popover>
  )
}

export default JumpToFolio
