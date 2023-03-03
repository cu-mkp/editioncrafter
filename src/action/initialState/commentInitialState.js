export default function commentInitialState(editionBaseURL) {
  return {
    commentsURL: `${editionBaseURL}/comments.json`,
    comments: {},
    loaded: false,
  };
}
