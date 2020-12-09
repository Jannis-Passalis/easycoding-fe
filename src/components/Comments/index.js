import React, { useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectAllPosts } from "../../store/post/selectors";
import { Accordion, Button, Card, Col, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { postNewPostComment, postNewPostReply } from "../../store/post/actions";
import {
  postNewRequestComment,
  postNewRequestReply,
} from "../../store/request/actions";
import Loading from "../Loading";
import { selectRequests } from "../../store/request/selectors";

export default function Comments({ requestId, commentType }) {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const dispatch = useDispatch();
  const params = useParams();
  const posts = useSelector(selectAllPosts);
  const requests = useSelector(selectRequests);
  const id = parseInt(params.post) || requestId;
  const [commentId, setCommentId] = useState("");

  // console.log("WHAT IS ID", id);
  // console.log("WHAT IS commentType", commentType);

  const postOrRequest =
    commentType === "post"
      ? posts.find((post) => post.id === id)
      : requests.find((req) => req.id === id);

  function submitNewComment(event) {
    event.preventDefault();

    if (commentType === "post") {
      dispatch(postNewPostComment(commentText, id));
      return setCommentText("");
    }

    dispatch(postNewRequestComment(commentText, id));
    setCommentText("");
  }

  function submitNewReply(event) {
    event.preventDefault();

    if (commentType === "post") {
      dispatch(postNewPostReply(replyText, id, commentId));
      return setReplyText("");
    }

    dispatch(postNewRequestReply(replyText, id, commentId));
    setReplyText("");
  }

  return (
    <div>
      <h5 style={{ marginTop: "0.5rem", marginLeft: "1rem" }}>Comments</h5>
      {!postOrRequest ? (
        <Loading />
      ) : (
        postOrRequest.comments.map((comment) => {
          return (
            <Card
              bg="light"
              key={comment.id}
              style={{ width: "60rem" }}
              className="mb-2"
            >
              <Card.Body>
                <Card.Text>{comment.content}</Card.Text>
              </Card.Body>
              <Card.Footer
                style={{
                  fontSize: "0.7rem",
                  borderBottom: "inherit",
                }}
              >
                by {comment.user.name} on{" "}
                {moment(comment.createdAt).format("ddd DD MMMM YYYY HH:mm")}
              </Card.Footer>

              {comment.answers.length ? (
                <Accordion>
                  <Card
                    bg="light"
                    style={{
                      width: "58rem",
                      marginLeft: "2rem",
                    }}
                    // className="mt-2 mb-2"
                  >
                    <Accordion.Toggle
                      as={Card.Header}
                      style={{
                        background: "lightgrey",
                        fontSize: "0.9rem",
                        margin: "0",
                        padding: "0.5rem",
                      }}
                      eventKey="0"
                    >
                      Replies (click here)
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                      <div>
                        {comment.answers.map((answer) => {
                          return (
                            <Card.Body
                              key={answer.id}
                              style={{ borderBottom: "solid 1px lightgrey" }}
                            >
                              {answer.content}
                              <p style={{ margin: "0", fontSize: "0.7rem" }}>
                                by {answer.user.name} on{" "}
                                {moment(answer.createdAt).format(
                                  "ddd DD MMMM YYYY HH:mm"
                                )}
                              </p>
                            </Card.Body>
                          );
                        })}
                      </div>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              ) : null}
              <Accordion>
                <Card
                  bg="light"
                  style={{
                    width: "58rem",
                    marginLeft: "2rem",
                  }}
                  // className="mb-2"
                >
                  <Accordion.Toggle
                    as={Card.Header}
                    style={{
                      background: "lightgrey",
                      fontSize: "0.9rem",
                      margin: "0",
                      padding: "0.5rem",
                    }}
                    eventKey="0"
                  >
                    Reply to this comment (click here)
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <div>
                      <Form as={Col} md={{ span: 8 }} className="mt-3">
                        <h6>New reply:</h6>
                        <Form.Group controlId="formBasicReplyText">
                          <Form.Control
                            value={replyText}
                            onChange={(event) => {
                              setCommentId(comment.id);
                              return setReplyText(event.target.value);
                            }}
                            type="text"
                            as="textarea"
                            rows={4}
                            placeholder="Type your reply here.."
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mt-3">
                          <Button
                            variant="success"
                            type="submit"
                            disabled={replyText ? false : true}
                            onClick={submitNewReply}
                          >
                            Post reply
                          </Button>
                        </Form.Group>
                      </Form>
                    </div>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Card>
          );
        })
      )}

      <Form as={Col} md={{ span: 6 }} className="mt-3">
        <h5>New comment:</h5>
        <Form.Group controlId="formBasicCommentText">
          <Form.Control
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            type="text"
            as="textarea"
            rows={4}
            placeholder="Type your comment here.."
            required
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Button
            variant="success"
            type="submit"
            disabled={commentText ? false : true}
            onClick={submitNewComment}
          >
            Post comment
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
