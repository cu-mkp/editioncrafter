import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Cancel'
import React from 'react'

function FigureDialog({ img, onClose, open }) {
  const handleClose = () => {
    onClose()
  }

  const closeButtonBackground = {
    position: 'absolute',
    right: 0,
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'rgb(0,0,0,0.2)',
    borderRadius: '0 0 0 50%',
  }

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{ style: { maxWidth: '90%', maxHeight: '80%' } }}
    >
      <div className="figure-dialog-img-container" style={{ overflowY: 'scroll' }}>
        {img}
      </div>
      <div style={closeButtonBackground}>
        <IconButton style={{ color: 'white', position: 'absolute' }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
    </Dialog>
  )
}

FigureDialog.propTypes = {
}

function FigureImage({ img }) {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = (value) => {
    setOpen(false)
  }

  return (
    <div className="figure-image-container">
      <div onClick={handleClickOpen}>
        {img}
      </div>
      <FigureDialog open={open} onClose={handleClose} img={img} />
    </div>
  )
}

export default FigureImage
