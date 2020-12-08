import React, { useState } from "react";
import { Button, Col, Container, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { createPost } from "../../store/post/actions";

export default function NewPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [picture, setPicture] = useState("");
  const dispatch = useDispatch();

  function submitForm(event) {
    event.preventDefault();

    dispatch(createPost(title, content));

    setTitle("");
    setContent("");
    setPicture("");
  }
  return (
    <Container>
      <Form as={Col} md={{ span: 6, offset: 3 }} className="mt-5">
        <h1 className="mt-5 mb-5">Create Post</h1>
        <Form.Group controlId="formPostTitle">
          <Form.Label>Post Title</Form.Label>
          <Form.Control
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            type="title"
            placeholder="Enter title"
            required
          />
        </Form.Group>

        <Form.Group controlId="formPostText">
          <Form.Label>Post Text</Form.Label>
          <Form.Control
            value={content}
            onChange={(event) => setContent(event.target.value)}
            type="text"
            placeholder="Enter content"
            required
          />
        </Form.Group>
        <Form.Group controlId="formPostPicture">
          <Form.Label>Post Picture</Form.Label>
          <Form.Control
            value={picture}
            onChange={(event) => setPicture(event.target.value)}
            type="picture"
            placeholder="picture"
            required
          />
        </Form.Group>
        <Form.Group className="mt-5">
          <Button variant="primary" type="submit" onClick={submitForm}>
            Create Post
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
}