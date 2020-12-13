import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { Header, Comment } from "semantic-ui-react";
import Comments from "./Comments.js";
import User from "./User.js";
import axios from "axios";
import { useHistory } from "react-router-dom";

function CommentSection(props) {
  const tx = document.getElementsByTagName("textarea");
  for (let i = 0; i < tx.length; i++) {
    tx[i].setAttribute(
      "style",
      "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
    );
    tx[i].addEventListener("input", OnInput, false);
  }

  function OnInput() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }
  const user = User();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [validated, setValidated] = useState(false);
  const history = useHistory();

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/comment", {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setComments(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      axios
        .post(
          "http://localhost:8080/comment",
          {
            comment: comment,
            creator: user.email,
            project: parseInt(props.project),
          },
          {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setValidated(true);
  };

  return (
    <div className="card mt-5 mb-3">
      <Card bg={"Light".toLocaleLowerCase()}>
        <Card.Header>Comentarios</Card.Header>
        <Card.Body>
          <Card.Text>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Control
                onChange={handleComment}
                as="textarea"
                type="text"
                placeholder="Agregar un comentario"
                rows="3"
                cols="50"
                required
              />
              <Button variant="primary" type="submit">
                Comentar
              </Button>
            </Form>
            <div>
              <br></br>
              <Row>
                <Comment.Group>
                  {comments
                    .filter((c) => c.project == props.project)
                    .reverse()
                    .map((c) => (
                      <Comments
                        comment={c}
                        reply={comments.filter((v) => v.replyOf === c.id)}
                      />
                    ))}
                </Comment.Group>
              </Row>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CommentSection;