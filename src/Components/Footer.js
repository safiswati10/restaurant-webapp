import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#FA8C16",
        color: "white",
        padding: "20px 0",
        marginTop: "20px",
      }}
    >
      <Container>
        <Row>
          <Col md={4}>
            <h5>About Us</h5>
            <p>
              We deliver delicious food to your doorstep with the best deals and
              offers.
            </p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  to="/deals"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Deals
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <p>Stay updated with our latest offers:</p>
            <div>
              <a href="https://facebook.com" style={{ color: "white", marginRight: "10px" }}>
                Facebook
              </a>
              <a href="https://instagram.com" style={{ color: "white", marginRight: "10px" }}>
                Instagram
              </a>
              <a href="https://x.com" style={{ color: "white" }}>
                Twitter
              </a>
            </div>
          </Col>
        </Row>
        <hr style={{ borderColor: "white" }} />
        <p className="text-center">
          © {new Date().getFullYear()} Food Ordering App. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
