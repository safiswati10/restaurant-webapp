import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Form, FormControl, Button } from "react-bootstrap";
import { FaShoppingCart, FaUserCircle, FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <Navbar expand="lg" variant="light" className="shadow" style={{ backgroundColor: "#FFFFFF" }}>

      <Container>
        {/* Logo */}
        <Navbar.Brand href="/" className="fw-bold fs-3">
          <img src="logo.jpg" alt="Logo" width="100" height="100" />
        </Navbar.Brand>

        {/* Mobile Toggle Button */}
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {/* Navigation Links */}
          <Nav className="mx-auto">
            <Nav.Link href="/" style={{ color: "#FA8C16" }} className="fw-semibold mx-2">Home</Nav.Link>
            <Nav.Link href="/restaurants" style={{ color: "#FA8C16" }} className="fw-semibold mx-2">Restaurants</Nav.Link>
            <Nav.Link href="/deals" style={{ color: "#FA8C16" }} className="fw-semibold mx-2">Deals</Nav.Link>
            <Nav.Link href="/categories" style={{ color: "#FA8C16" }} className="fw-semibold mx-2">Categories</Nav.Link>
          </Nav>

          {/* Search Bar */}
          <Form className="d-flex me-lg-3 my-2 my-lg-0">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaSearch style={{ color: "#FA8C16" }} />
              </span>
              <FormControl type="text" placeholder="Search food or restaurants" className="rounded-end" />
            </div>
          </Form>

          {/* User Actions */}
          <div className="d-flex align-items-center">
            <Button href="/ListYourResturant" style={{ backgroundColor: "#FA8C16", borderColor: "#FA8C16" }} className="me-3 fw-semibold">
              List Your Restaurant
            </Button>
            <Nav.Link href="/track-order" style={{ color: "#FA8C16" }} className="fw-semibold me-3">Track Order</Nav.Link>
            <Nav.Link href="/cart">
              <FaShoppingCart size={22} style={{ color: "#FA8C16" }} className="mx-2" />
            </Nav.Link>
            <Nav.Link href="/profile">
              <FaUserCircle size={22} style={{ color: "#FA8C16" }} className="mx-2" />
            </Nav.Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
