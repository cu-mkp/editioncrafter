export default function glossaryInitialState(glossaryURL) {
  return {
    glossaryURL,
    glossary: {},
    loaded: false,
  };
}
