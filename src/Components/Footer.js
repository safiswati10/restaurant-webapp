import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#FA8C16", color: "white", padding: "20px 0", marginTop: "20px" }}>
      <Container>
        <Row>
          <Col md={4}>
            <h5>About Us</h5>
            <p>We deliver delicious food to your doorstep with the best deals and offers.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li><a href="#" style={{ color: "white", textDecoration: "none" }}>Home</a></li>
              <li><a href="#" style={{ color: "white", textDecoration: "none" }}>Restaurants</a></li>
              <li><a href="#" style={{ color: "white", textDecoration: "none" }}>Deals</a></li>
              <li><a href="#" style={{ color: "white", textDecoration: "none" }}>Contact</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <p>Stay updated with our latest offers:</p>
            <div>
              <a href="#" style={{ color: "white", marginRight: "10px" }}>Facebook</a>
              <a href="#" style={{ color: "white", marginRight: "10px" }}>Instagram</a>
              <a href="#" style={{ color: "white" }}>Twitter</a>
            </div>
          </Col>
        </Row>
        <hr style={{ borderColor: "white" }} />
        <p className="text-center">© {new Date().getFullYear()} Food Ordering App. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
