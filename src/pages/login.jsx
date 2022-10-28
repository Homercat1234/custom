import React, { useState, useEffect } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import Cookies from "universal-cookie";

//https://frontendshape.com/post/react-bootstrap-5-login-form-example

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();

  useEffect(() => {
    const loggedInUser = new Cookies();
    if (loggedInUser.get("user")) {
      navigate("/home")
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    Axios.post("http://localhost:5000/account/login", {
      email: email,
      password: password,
    })
      .then(function (res) {
        console.log(res.data.expires);
        const cookies = new Cookies();
        cookies.set("user", res.data.auth, { path: "/", expires: (new Date(res.data.expires)) });
        navigate("/home");
      })
      .catch(function (error) {
        // error response flow
      });
  };

  return (
    <div>
      <Container>
        <Row className="d-flex py-3 justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Card bg="dark">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-uppercase text-light">
                    Login
                  </h2>
                  <p className=" mb-5 text-secondary">
                    Please enter your email and password!
                  </p>
                  <div className="mb-3">
                    <Form onSubmit={submitHandler}>
                      <Form.Group
                        className="mb-3 text-white"
                        controlId="formBasicEmail"
                      >
                        <Form.Label className="text-center">
                          Email address
                        </Form.Label>
                        <Form.Control
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
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          placeholder="Password"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      >
                        <p className="small">
                          <a className="text-info" href="#!">
                            Forgot password?
                          </a>
                        </p>
                      </Form.Group>
                      <div className="d-grid">
                        <Button variant="secondary" type="submit">
                          Login
                        </Button>
                      </div>
                    </Form>
                    <div className="mt-3">
                      <p className="mb-0  text-center text-light">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-info fw-bold">
                          Register
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
    </div>
  );
}
