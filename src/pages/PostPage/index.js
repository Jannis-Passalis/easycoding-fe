import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { deletePostAsAdmin, fetchPosts } from "../../store/post/actions";
import { selectAllPosts } from "../../store/post/selectors";
import { Button, Card, Form, FormControl } from "react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import FavouriteButton from "../../components/FavouriteButton";
import Loading from "../../components/Loading";
import { selectToken, selectUser } from "../../store/user/selectors";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export default function PostPage() {
  const history = useHistory();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const { searchText: searchTextParams } = useParams();
  const [searchText, setSearchText] = useState(
    !searchTextParams ? "" : searchTextParams
  );
  const [search, setSearch] = useState(searchText);
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);

  const searchResult = search
    ? posts.filter(
        (post) =>
          post.content.toLowerCase().indexOf(search.toLowerCase()) !== -1
      )
    : "";

  useEffect(() => {
    dispatch(fetchPosts);
    if (searchTextParams) {
      setSearchText(searchTextParams);
      setSearch(searchTextParams);
    }
  }, [dispatch, searchTextParams]);

  async function submitForm(event) {
    event.preventDefault();
    setSearch(searchText);
    if (searchText === search) {
      return;
    } else if (!searchText) {
      return history.push(`/posts`);
    } else {
      return history.push(`/posts/${searchText}`);
    }
  }

  function deleteByAdmin(event) {
    console.log(event.target.value);
    event.preventDefault();
    dispatch(deletePostAsAdmin(event.target.value));
  }

  return (
    <div>
      <h1>Post page</h1>
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
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          type="text"
          placeholder="Search For Posts"
          className="mr-sm-2"
        />
        <Button variant="outline-primary" onClick={submitForm}>
          Search
        </Button>
        <p style={{ margin: "20px" }}>or</p>
        <Link to={!token ? "/login" : "/post/new"}>
          <Button variant="outline-success">Create New Post</Button>
        </Link>
      </Form>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          marginLeft: "5%",
          marginRight: "5%",
        }}
      >
        {!posts ? (
          <Loading />
        ) : !search ? (
          posts.map((post) => {
            return (
              <Card
                border="dark"
                key={post.id}
                style={{ margin: "1rem", width: "20rem" }}
              >
                <Card.Header as="h6">
                  {!token ? null : <FavouriteButton postId={post.id} />}{" "}
                  <Link
                    style={{ color: "inherit" }}
                    to={`/posts/details/${post.id}`}
                  >
                    {post.title}
                  </Link>
                </Card.Header>
                <Card.Body>
                  <ReactMarkdown
                    plugins={[gfm]}
                    children={post.content.slice(0, 100)}
                  />
                  ...
                </Card.Body>

                <Card.Footer style={{ background: "white" }}>
                  <Link to={`/posts/details/${post.id}`}>
                    <Button variant="outline-secondary">View Details</Button>
                  </Link>{" "}
                  {user.id !== parseInt(post.userId) ? null : (
                    <Link to={`/posts/edit/${post.id}`}>
                      <Button variant="outline-secondary">Edit</Button>
                    </Link>
                  )}{" "}
                  {!user.isAdmin ? null : (
                    <Button
                      onClick={deleteByAdmin}
                      value={post.id}
                      variant="outline-danger"
                    >
                      Delete
                    </Button>
                  )}
                </Card.Footer>
                <Card.Footer style={{ fontSize: "0.8rem" }}>
                  By {post.author.name} on{" "}
                  {moment(post.createdAt).format("ddd DD MMMM YYYY HH:mm")}
                </Card.Footer>
              </Card>
            );
          })
        ) : (
          searchResult.map((post) => {
            return (
              <Card
                border="dark"
                key={post.id}
                style={{ margin: "1rem", width: "20rem" }}
              >
                <Card.Header as="h6">
                  {!token ? (
                    <Link to="/login">
                      <Button href="/login" variant="outline-success">
                        Favourite
                      </Button>
                    </Link>
                  ) : (
                    <FavouriteButton postId={post.id} />
                  )}{" "}
                  <Link
                    style={{ color: "inherit" }}
                    to={`/posts/details/${post.id}`}
                  >
                    {post.title}
                  </Link>
                </Card.Header>
                <Card.Body>
                  <ReactMarkdown
                    plugins={[gfm]}
                    children={post.content.slice(0, 100)}
                  />
                  ...
                </Card.Body>

                <Card.Footer style={{ background: "white" }}>
                  <Link to={`/posts/details/${post.id}`}>
                    <Button variant="outline-secondary">View Details</Button>
                  </Link>{" "}
                  {user.id !== parseInt(post.userId) ? null : (
                    <Link to={`/posts/edit/${post.id}`}>
                      <Button variant="outline-secondary">Edit</Button>
                    </Link>
                  )}{" "}
                  {!user.isAdmin ? null : (
                    <Button
                      onClick={deleteByAdmin}
                      value={post.id}
                      variant="outline-danger"
                    >
                      Delete
                    </Button>
                  )}
                </Card.Footer>
                <Card.Footer style={{ fontSize: "0.8rem" }}>
                  By {post.author.name} on{" "}
                  {moment(post.createdAt).format("ddd DD MMMM YYYY HH:mm")}
                </Card.Footer>
              </Card>
            );
          })
        )}
        {posts && search && !searchResult.length ? (
          <h3>No search results</h3>
        ) : null}
      </div>
    </div>
  );
}
