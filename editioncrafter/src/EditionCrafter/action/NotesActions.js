const NotesActions = {}

NotesActions.loadNotes = function loadNotes(state, noteData) {
  return {
    ...state,
    loaded: true,
    notes: noteData,
  }
}

export default NotesActions
