export default function glossaryInitialState(editionBaseURL) {
  return {
    glossaryURL: `${editionBaseURL}/glossary.json`,
    glossary: {},
    loaded: false,
  };
}
