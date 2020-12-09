import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import { selectAppLoading } from "../../store/appState/selectors";
import { fetchRequests } from "../../store/request/actions";
import { selectRequests } from "../../store/request/selectors";
import { Button, Card, Form, FormControl } from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";

export default function RequestPage() {
  const dispatch = useDispatch();
  const requests = useSelector(selectRequests);
  const loading = useSelector(selectAppLoading);
  console.log("what is requests", requests);
  useEffect(() => {
    dispatch(fetchRequests);
  }, [dispatch]);
  return (
    <div>
      <h1>Request page</h1>
      <Form
        inline
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          margin: "20px",
        }}
      >
        <FormControl
          type="text"
          placeholder="Search For Requests"
          className="mr-sm-2"
        />
        <Button variant="outline-primary">Search</Button>
        <p style={{ margin: "20px" }}>or</p>
        <Link to="/requests/new">
          <Button variant="success">Create New Request</Button>
        </Link>
      </Form>
      {loading ? (
        <Loading />
      ) : (
        requests.map((req) => {
          return (
            <Card key={req.id} style={{ margin: "1rem", width: "30rem" }}>
              <Card.Body>
                <Card.Header>{req.title}</Card.Header>
                <Card.Text>{req.content}</Card.Text>
              </Card.Body>
              <Card.Footer>
                requested by {req.user.name}{" "}
                {moment(req.createdAt).format("DD/MM/YYYY")}
              </Card.Footer>
            </Card>
          );
        })
      )}
    </div>
  );
}
