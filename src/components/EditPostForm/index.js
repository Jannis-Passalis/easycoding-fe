import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import UploadPostPicture from "../../components/UploadPostPicture";
import { updatePost, deletePost } from "../../store/post/actions";
import { selectToken, selectUser } from "../../store/user/selectors";
import ImagePreviewEdit from "../PreviewPictureEdit";

export default function EditPostForm(props) {
  const history = useHistory();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  if (!token || user.id !== parseInt(props.post.userId)) {
    history.push("/");
  }
  const [title, setTitle] = useState(props.post.title || "");
  const [content, setContent] = useState(props.post.content || "");
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();

  async function submitForm(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    event.preventDefault();
    setValidated(true);
    event.preventDefault();

    if (title !== "" && content !== "") {
      await dispatch(updatePost(title, content, props.post.id));
      setTitle("");
      setContent("");
      history.push("/posts");
    }
  }

  const handleDelete = (event) => {
    event.preventDefault();
    dispatch(deletePost(props.post.id));
    history.push("/posts");
  };

  return (
    <div>
      <h1>Create Post</h1>
      <Container>
        <Form
          md={{ span: 6, offset: 3 }}
          noValidate
          validated={validated}
          onSubmit={submitForm}
        >
          <Form.Group controlId="formPostTitle">
            <Form.Label>Post Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              type="title"
              placeholder="Enter title"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a title.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formPostText">
            <Form.Label>Post Text</Form.Label>
            <Form.Control
              value={content}
              onChange={(event) => setContent(event.target.value)}
              type="text"
              as="textarea"
              rows={13}
              placeholder="Enter content"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a text.
            </Form.Control.Feedback>
          </Form.Group>
          <ImagePreviewEdit postId={props.post.id} />
          <UploadPostPicture />
          <Form.Group className="mt-5">
            <Button variant="primary" type="submit">
              Edit Post
            </Button>
          </Form.Group>
          <Button variant="danger" onClick={handleDelete}>
            Delete Post
          </Button>
        </Form>
      </Container>
    </div>
  );
}
