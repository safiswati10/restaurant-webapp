import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import axios from 'axios';

const RestaurantSignup = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    my_file: null,
    address: "",
    phone: "",
    owner_name: "",
    owner_phone: "",
    owner_email: "",
    password: "",
    retypePassword: ""
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, my_file: e.target.files[0] });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Restaurant name is required";
    if (!formData.type) newErrors.type = "Restaurant type is required";
    if (!formData.my_file) newErrors.my_file = "Restaurant image is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.owner_name) newErrors.owner_name = "Owner name is required";
    if (!formData.owner_email) newErrors.owner_email = "Owner email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.retypePassword) newErrors.retypePassword = "Please retype your password";
    if (formData.password !== formData.retypePassword)
      newErrors.retypePassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("my_file", formData.my_file);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("retypePassword", formData.retypePassword);
      formDataToSend.append("owner_name", formData.owner_name);
      formDataToSend.append("owner_phone", formData.owner_phone);
      formDataToSend.append("owner_email", formData.owner_email);
      formDataToSend.append("type", formData.type);

      const response = await fetch(
        "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/pendingRestaurants/insert-pendingRestaurant",
        {
          method: "POST",
          body: formDataToSend,
        }
      );
      


      const responseText = await response.text();
      console.log("Raw response:", responseText);

      try {
        const result = responseText ? JSON.parse(responseText) : {};
        if (response.ok && result.status === 1) {
           console.log("Registration successful:", result);
           navigate("/RestaurantDashboard");
        } else  {
          const errorMsg = result.message || `Registration failed (Status: ${response.status})`;
          setApiError(errorMsg);
          console.error("Registration failed:", result);
        }
      } catch (e) {
        setApiError("Server returned unexpected response. Please check console for details.");
        console.error("Failed to parse response:", responseText);
      }
    } catch (error) {
      setApiError("Network error: " + error.message);
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ color: "#FA8C16" }}>
        Restaurant Signup
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
            {apiError && (
              <Alert variant="danger" className="mb-4">
                {apiError}
              </Alert>
            )}
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              {["name", "type", "address", "phone", "owner_name", "owner_phone", "owner_email", "password", "retypePassword"].map((field) => (
                <Form.Group className="mb-3" key={field}>
                  <Form.Label>{field.replace(/_/g, " ").toUpperCase()}</Form.Label>
                  <Form.Control
                    type={field.includes("password") ? "password" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    isInvalid={!!errors[field]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[field]}
                  </Form.Control.Feedback>
                </Form.Group>
              ))}

              <Form.Group className="mb-3">
                <Form.Label>Restaurant Image</Form.Label>
                <Form.Control
                  type="file"
                  name="my_file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  isInvalid={!!errors.my_file}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.my_file}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: "#FA8C16",
                  border: "none",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  width: "100%",
                }}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RestaurantSignup;