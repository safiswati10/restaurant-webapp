import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutUs = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ color: "#FA8C16" }}>
        About Us
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
            <h3 className="mb-4" style={{ color: "#FA8C16" }}>
              Our Story
            </h3>
            <p>
              Welcome to <strong style={{ color: "#FA8C16" }}>RestaurantApp</strong>, where we bring the best dining experience to your doorstep.
              Founded in 2023, our mission is to connect food lovers with their favorite restaurants and dishes.
              Whether you're craving a quick bite or a gourmet meal, we've got you covered.
            </p>

            <h3 className="mt-4 mb-3" style={{ color: "#FA8C16" }}>
              Our Mission
            </h3>
            <p>
              Our mission is to make dining convenient, enjoyable, and accessible for everyone.
              We work closely with local restaurants to ensure you get the freshest and most delicious meals.
            </p>

            <h3 className="mt-4 mb-3" style={{ color: "#FA8C16" }}>
              Our Team
            </h3>
            <p>
              Our team is made up of passionate foodies, tech enthusiasts, and customer service experts.
              We are dedicated to providing you with the best experience possible.
            </p>

            <h3 className="mt-4 mb-3" style={{ color: "#FA8C16" }}>
              Why Choose Us?
            </h3>
            <ul>
              <li>Wide variety of restaurants and cuisines</li>
              <li>Easy-to-use platform</li>
              <li>Fast and reliable delivery</li>
              <li>Excellent customer support</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;