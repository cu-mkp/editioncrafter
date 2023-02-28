export default function(editionBaseURL) {
    return {
        commentsURL: `${editionBaseURL}/comments.json`,  
        comments: {},
        loaded: false    
    }
}	