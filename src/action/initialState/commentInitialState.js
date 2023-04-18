export default function commentInitialState(commentsURL) {
  return {
    commentsURL,
    comments: {},
    loaded: false,
  };
}
