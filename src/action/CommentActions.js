const CommentsActions = {};

CommentsActions.loadComments = function loadComments(state, commentData) {
  return {
    ...state,
    loaded: true,
    comments: commentData,
  };
};

export default CommentsActions;
