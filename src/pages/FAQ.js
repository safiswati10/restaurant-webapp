import React from "react";
import { Container, Accordion, Card, Row, Col } from "react-bootstrap";
import "../styles/HomePage.css"; 
const FAQ = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ color: "#FA8C16" }}>
        Frequently Asked Questions
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
              {/* FAQ Item 1 */}
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
                    <h5>1. How do I place an order?</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    To place an order, simply browse through our list of
                    restaurants, select your desired dishes, and proceed to
                    checkout. You can pay using various payment methods, including
                    credit/debit cards, PayPal, or cash on delivery.
                  </Accordion.Body>
                </Accordion.Item>
              </Card>

              {/* FAQ Item 2 */}
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
                    <h5>2. What payment methods are accepted?</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    We accept a wide range of payment methods, including
                    credit/debit cards, PayPal, and cash on delivery. All payments
                    are processed securely.
                  </Accordion.Body>
                </Accordion.Item>
              </Card>

              {/* FAQ Item 3 */}
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
                    <h5>3. How can I track my order?</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    Once your order is confirmed, you can track its status in
                    real-time through your account. You will also receive updates
                    via email or SMS.
                  </Accordion.Body>
                </Accordion.Item>
              </Card>

              {/* FAQ Item 4 */}
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
                    <h5>4. Can I modify or cancel my order?</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    You can modify or cancel your order within 5 minutes of
                    placing it. After that, the order will be processed, and
                    changes may not be possible.
                  </Accordion.Body>
                </Accordion.Item>
              </Card>

              {/* FAQ Item 5 */}
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
                    <h5>5. What if I have dietary restrictions?</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    Many restaurants offer options for dietary restrictions, such
                    as vegetarian, vegan, gluten-free, or nut-free meals. You can
                    filter restaurants by dietary options or contact the restaurant
                    directly for more information.
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

export default FAQ;