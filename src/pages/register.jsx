import React, { useState, useEffect } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";

//https://frontendshape.com/post/react-bootstrap-5-login-form-example

export default function Register() {
  const [usernameRef, setUsername] = useState();
  const [emailRef, setEmail] = useState();
  const [passwordRef, setPassword] = useState();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    console.log(localStorage.getItem("user"));
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  useEffect(() => {
    if (user) navigate("/home");
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(usernameRef);
    Axios.post("http://localhost:5000/account", {
      name: usernameRef,
      password: passwordRef,
      email: emailRef,
    })
      .then(function (res) {
        setUser({
          auth: res.data["authtoken"],
          username: usernameRef,
          email: emailRef,
        });
        localStorage.setItem("user", JSON.stringify({user}));
      })
      .catch(function (error) {
        // error response flow
      });
  };

  return (
    <Container>
      <Row className="d-flex py-3 justify-content-center align-items-center">
        <Col md={8} lg={6} xs={12}>
          <Card bg="dark">
            <Card.Body>
              <div className="mb-3 mt-md-4">
                <h2 className="fw-bold mb-2 text-uppercase text-light">
                  Register
                </h2>
                <p className=" mb-5 text-secondary">
                  Register if you don't have an account!
                </p>
                <div className="mb-3">
                  <Form onSubmit={submitHandler}>
                    <Form.Group
                      className="mb-3 text-white"
                      controlId="formBasicEmail"
                    >
                      <Form.Label className="text-center">Username</Form.Label>
                      <Form.Control
                        required
                        type="username"
                        placeholder="Enter username"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3 text-white"
                      controlId="formBasicEmail"
                    >
                      <Form.Label className="text-center">
                        Email address
                      </Form.Label>
                      <Form.Control
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter email"
                      />
                    </Form.Group>

                    <Form.Group
                      className="mb-3 text-white"
                      controlId="formBasicPassword"
                    >
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-3"
                        type="password"
                        placeholder="Password"
                      />
                    </Form.Group>
                    <div className="d-grid">
                      <Button variant="secondary" type="submit">
                        Register
                      </Button>
                    </div>
                  </Form>
                  <div className="mt-3">
                    <p className="mb-0  text-center text-light">
                      Already have an acccount?{" "}
                      <Link to="/login" className="text-info fw-bold">
                        Login
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
