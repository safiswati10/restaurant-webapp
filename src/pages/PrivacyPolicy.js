import React from "react";
import { Container, Accordion, Card, Row, Col } from "react-bootstrap";
import "../styles/HomePage.css"; 

const PrivacyPolicy = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ color: "#FA8C16" }}>
        Privacy Policy
      </h2>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card
            style={{
              border: "none",
              borderRadius: "10px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
              padding: "2rem",
            }}
          >
            <Accordion defaultActiveKey="0">
              {/* Policy Section 1 */}
              <Card>
                <Accordion.Item eventKey="0">
                  <Accordion.Header
                    style={{
                      backgroundColor: "#FA8C16",
                      color: "white",
                      borderRadius: "5px",
                      marginBottom: "10px",
                    }}
                  >
                    <h5>1. Information We Collect</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    We collect personal information such as your name, email
                    address, phone number, and payment details when you use our
                    services. This information is necessary to process your
                    orders and provide a seamless experience.
                  </Accordion.Body>
                </Accordion.Item>
              </Card>

              {/* Policy Section 2 */}
              <Card>
                <Accordion.Item eventKey="1">
                  <Accordion.Header
                    style={{
                      backgroundColor: "#FA8C16",
                      color: "white",
                      borderRadius: "5px",
                      marginBottom: "10px",
                    }}
                  >
                    <h5>2. How We Use Your Data</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    Your data is used to process orders, improve our services,
                    and communicate with you about promotions, updates, and
                    order status. We do not share your data with third parties
                    without your consent.
                  </Accordion.Body>
                </Accordion.Item>
              </Card>

              {/* Policy Section 3 */}
              <Card>
                <Accordion.Item eventKey="2">
                  <Accordion.Header
                    style={{
                      backgroundColor: "#FA8C16",
                      color: "white",
                      borderRadius: "5px",
                      marginBottom: "10px",
                    }}
                  >
                    <h5>3. Data Security</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    We implement industry-standard security measures to protect
                    your data from unauthorized access, including encryption and
                    secure payment gateways.
                  </Accordion.Body>
                </Accordion.Item>
              </Card>

              {/* Policy Section 4 */}
              <Card>
                <Accordion.Item eventKey="3">
                  <Accordion.Header
                    style={{
                      backgroundColor: "#FA8C16",
                      color: "white",
                      borderRadius: "5px",
                      marginBottom: "10px",
                    }}
                  >
                    <h5>4. Your Rights</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    You have the right to access, modify, or delete your personal
                    information at any time. You can also opt out of receiving
                    promotional emails by updating your preferences in your
                    account settings.
                  </Accordion.Body>
                </Accordion.Item>
              </Card>

              {/* Policy Section 5 */}
              <Card>
                <Accordion.Item eventKey="4">
                  <Accordion.Header
                    style={{
                      backgroundColor: "#FA8C16",
                      color: "white",
                      borderRadius: "5px",
                      marginBottom: "10px",
                    }}
                  >
                    <h5>5. Cookies</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    We use cookies to enhance your browsing experience and
                    analyze website traffic. You can disable cookies in your
                    browser settings, but this may affect the functionality of
                    our website.
                  </Accordion.Body>
                </Accordion.Item>
              </Card>
            </Accordion>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PrivacyPolicy;