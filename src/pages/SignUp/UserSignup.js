import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  InputGroup,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    retypePassword: "",
    address: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const PROXY_URL = "https://thingproxy.freeboard.io/fetch/";
      const API_URL =
        "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/users/insert-user";

      const response = await fetch(PROXY_URL + API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          address: formData.address,
        }),
      });

      const responseText = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        if (responseText.toLowerCase().includes("email already exists")) {
          throw new Error(
            "This email is already registered. Please use a different email or log in."
          );
        }
        throw new Error("Registration failed. Please try again.");
      }

      if (!response.ok) {
        if (
          responseData.message &&
          (responseData.message
            .toLowerCase()
            .includes("email already exists") ||
            responseData.message
              .toLowerCase()
              .includes("email is already registered"))
        ) {
          throw new Error(
            "This email is already registered. Please use a different email or log in."
          );
        }
        throw new Error(
          responseData.message || "Registration failed. Please try again."
        );
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/profile");
      }, 2000);

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        retypePassword: "",
        address: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4" style={{ color: "#fa8c16" }}>
                Create Account
              </h2>

              {error && (
                <Alert variant="danger" className="rounded-0">
                  {error}
                  {error.includes("already registered") && (
                    <div className="mt-2">
                      <a
                        href="/login"
                        style={{
                          color: "#fff",
                          textDecoration: "underline",
                          fontWeight: "bold",
                        }}
                      >
                        Click here to log in
                      </a>
                    </div>
                  )}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="rounded-0">
                  Registration successful! Redirecting to profile...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="py-2"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="py-2"
                    required
                    isInvalid={error && error.includes("already registered")}
                  />
                  {error && error.includes("already registered") && (
                    <Form.Control.Feedback type="invalid">
                      Email is already registered
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="py-2"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="py-2"
                      minLength="6"
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={togglePasswordVisibility}
                      style={{ borderColor: "#ced4da" }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.retypePassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          retypePassword: e.target.value,
                        })
                      }
                      className="py-2"
                      minLength="6"
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={toggleConfirmPasswordVisibility}
                      style={{ borderColor: "#ced4da" }}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="py-2"
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 py-2 fw-bold"
                  disabled={isLoading}
                  style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
                >
                  {isLoading ? "Registering..." : "Sign Up"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Already have an account?{" "}
                  <a href="/login" style={{ color: "#fa8c16" }}>
                    Log in
                  </a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserSignup;
