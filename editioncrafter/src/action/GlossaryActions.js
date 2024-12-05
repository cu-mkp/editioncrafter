const GlossaryActions = {}

GlossaryActions.loadGlossary = function loadAuthors(state, glossaryData) {
  return {
    ...state,
    loaded: true,
    glossary: glossaryData,
  }
}

export default GlossaryActions
