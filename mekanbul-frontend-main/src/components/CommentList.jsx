import Comment from "./Comment"; i

const CommentList = ({ commentList }) => {
  return commentList.map((comment, index) => (
    <Comment key={index} comment={comment} />
  ));
}

export default CommentList;
  