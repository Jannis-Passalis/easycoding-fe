import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Col, Form } from "react-bootstrap";
import { editPostReply } from "../../store/post/actions";
import { editRequestReply } from "../../store/request/actions";

export default function EditReply(props) {
  const [text, setText] = useState(props.content);
  const dispatch = useDispatch();

  // console.log("WHAT IS ID", id);
  console.log("WHAT IS", props.commentType);

  function editComment(event) {
    event.preventDefault();

    if (text === "") {
      return;
    }

    if (props.commentType === "post") {
      dispatch(editPostReply(text, props.id, props.postId, props.commentId));
      props.edit();
      return setText("");
    }

    dispatch(
      editRequestReply(text, props.id, props.requestId, props.commentId)
    );
    setText("");
    props.edit();
  }

  return (
    <div>
      <Form as={Col} md={{ span: 6 }} className="mt-3">
        <Form.Group controlId="formBasicCommentText">
          <Form.Control
            value={text}
            onChange={(event) => setText(event.target.value)}
            type="text"
            as="textarea"
            rows={4}
            required
            style={{
              fontSize: "0.7rem",
              borderBottom: "inherit",
            }}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Button
            variant="success"
            type="submit"
            disabled={text ? false : true}
            onClick={editComment}
            style={{
              fontSize: "0.7rem",
              borderBottom: "inherit",
            }}
            size="sm"
          >
            Submit
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
