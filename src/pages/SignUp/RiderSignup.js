import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const RiderSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    vehicle_type: "",
    vehicle_number: "",
    account_holder_name: "",
    account_number: "",
    iban: "",
    bank_name: "",
    password: "",
    retypePassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.vehicle_type) newErrors.vehicle_type = "Vehicle Type is required";
    if (!formData.vehicle_number) newErrors.vehicle_number = "Vehicle Number is required";
    if (!formData.account_holder_name) newErrors.account_holder_name = "Account Holder Name is required";
    if (!formData.account_number) newErrors.account_number = "Account Number is required";
    if (!formData.iban) newErrors.iban = "IBAN is required";
    if (!formData.bank_name) newErrors.bank_name = "Bank Name is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.retypePassword) newErrors.retypePassword = "Please retype your password";
    if (formData.password !== formData.retypePassword)
      newErrors.retypePassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      const data = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        vehicle_type: formData.vehicle_type,
        vehicle_number: formData.vehicle_number,
        account_holder_name: formData.account_holder_name,
        account_number: formData.account_number,
        iban: formData.iban,
        bank_name: formData.bank_name,
        password: formData.password,
        retypePassword: formData.retypePassword,
        joining_date: new Date().toISOString().split("T")[0]
      };
  
      try {
        const response = await fetch(
          "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/pendingRiders/insertPending-rider",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(data)
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to sign up. Please try again.");
        }

        const result = await response.json();
        console.log("API Response:", result);
  
        if (result.success) {
          localStorage.setItem("riderId", result.id || result.riderId); 
          localStorage.setItem("riderData", JSON.stringify(data)); 
          navigate("/RiderDashboard");
        } else {
          setApiError(result.message || "Failed to sign up. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        setApiError(error.message || "Server error. Please try again later.");
      }
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ color: "#FA8C16" }}>
        Rider Signup
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
             
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Phone", name: "phone", type: "text" },
                { label: "Address", name: "address", type: "text" },
                { label: "Vehicle Type", name: "vehicle_type", type: "text" },
                { label: "Vehicle Number", name: "vehicle_number", type: "text" },
                { label: "Account Holder Name", name: "account_holder_name", type: "text" },
                { label: "Account Number", name: "account_number", type: "text" },
                { label: "IBAN", name: "iban", type: "text" },
                { label: "Bank Name", name: "bank_name", type: "text" },
                { label: "Password", name: "password", type: "password" },
                { label: "Retype Password", name: "retypePassword", type: "password" },
              ].map(({ label, name, type }) => (
                <Form.Group className="mb-3" key={name}>
                  <Form.Label>{label}</Form.Label>
                  <Form.Control
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    isInvalid={!!errors[name]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[name]}
                  </Form.Control.Feedback>
                </Form.Group>
              ))}

            
              {apiError && <p className="text-danger">{apiError}</p>}

              
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
                Sign Up
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RiderSignup;