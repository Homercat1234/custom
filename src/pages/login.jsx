import React from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

//https://frontendshape.com/post/react-bootstrap-5-login-form-example

export default function Login() {
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
                    <Form>
                      <Form.Group
                        className="mb-3 text-white"
                        controlId="formBasicEmail"
                      >
                        <Form.Label className="text-center">
                          Email address
                        </Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                      </Form.Group>

                      <Form.Group
                        className="mb-3 text-white"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
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
