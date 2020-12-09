import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function NewRequestForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [validated, setValidated] = useState(false);
  const history = useHistory();

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
      //   await dispatch(createPost(title, content));
      setTitle("");
      setContent("");
      history.push("/requests");
    }
  }
  return (
    <div>
      <h1>Create Request</h1>
      <Container>
        <Form
          md={{ span: 6, offset: 3 }}
          noValidate
          validated={validated}
          onSubmit={submitForm}
        >
          <Form.Group controlId="formRequestTitle">
            <Form.Label>Request Title</Form.Label>
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
          <Form.Group controlId="formRequestText">
            <Form.Label>Request Text</Form.Label>
            <Form.Control
              value={content}
              onChange={(event) => setContent(event.target.value)}
              type="text"
              as="textarea"
              rows={2}
              placeholder="Enter content"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a text.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mt-5">
            <Button variant="primary" type="submit">
              Create Request
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
}
