import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.message) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      alert("Thank you for contacting us! We will get back to you soon.");
      setFormData({ name: "", email: "", message: "" }); 
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ color: "#FA8C16" }}>
        Contact Us
      </h2>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card
            style={{
              border: "none",
              borderRadius: "10px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
              padding: "2rem",
            }}
          >
            <Form onSubmit={handleSubmit}>
              {/* Name Field */}
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Email Field */}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Message Field */}
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Enter your message"
                  isInvalid={!!errors.message}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.message}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Submit Button */}
              <Button
                type="submit"
                style={{
                  backgroundColor: "#FA8C16",
                  border: "none",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  width: "100%",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#e67700")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#FA8C16")
                }
              >
                Submit
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Reach Out to Us Section */}
      <Row className="mt-5 justify-content-center">
        <Col md={8} lg={6}>
          <Card
            style={{
              border: "none",
              borderRadius: "10px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
              padding: "2rem",
              backgroundColor: "#f8f9fa",
            }}
          >
            <h4 className="text-center mb-4" style={{ color: "#FA8C16" }}>
              Reach Out to Us
            </h4>
            <Row className="text-center">
              <Col md={4}>
                <h5 style={{ color: "#FA8C16" }}>Email</h5>
                <p>support@restaurantapp.com</p>
              </Col>
              <Col md={4}>
                <h5 style={{ color: "#FA8C16" }}>Phone</h5>
                <p>+1 (123) 456-7890</p>
              </Col>
              <Col md={4}>
                <h5 style={{ color: "#FA8C16" }}>Address</h5>
                <p>123 Restaurant Street, Food City, FC 12345</p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;