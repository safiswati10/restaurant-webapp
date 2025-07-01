import React, { useContext, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  Dropdown,
} from "react-bootstrap";
import {
  FaShoppingCart,
  FaUserCircle,
  FaSearch,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate("/profile");
  };

  const getDashboardPath = () => {
    switch (role) {
      case "user":
        return "/UserDashboard";
      case "rider":
        return "/RiderDashboard";
      case "restaurant":
        return "/RestaurantDashboard";
      case "admin":
        return "/AdminDashboard";
      default:
        return "/";
    }
  };

  return (
    <Navbar expand="lg" variant="light" className="shadow py-2 bg-white">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">
          <img src="logo.jpg" alt="Logo" width="80" height="80" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            {["Home", "Restaurants", "Deals", "Categories"].map((item) => (
              <Nav.Link
                key={item}
                as={Link}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="fw-semibold mx-2"
                style={{ color: "#FA8C16" }}
              >
                {item}
              </Nav.Link>
            ))}
          </Nav>

          <Form className="d-flex me-lg-3 my-1 my-lg-0">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaSearch style={{ color: "#FA8C16" }} />
              </span>
              <FormControl
                type="text"
                placeholder="Search"
                className="rounded-end"
                style={{ height: "30px" }}
              />
            </div>
          </Form>

          <div className="d-flex align-items-center">
            <Button
              as={Link}
              to="/ListYourRestaurant"
              className="me-2 fw-semibold"
              style={{
                backgroundColor: "#FA8C16",
                borderColor: "#FA8C16",
                padding: "5px 10px",
                fontSize: "14px",
              }}
            >
              List Your Restaurant
            </Button>
            <Nav.Link
              as={Link}
              to="/track-order"
              className="fw-semibold me-2"
              style={{ color: "#FA8C16", fontSize: "14px" }}
            >
              Track Order
            </Nav.Link>
            <Nav.Link as={Link} to="/cart">
              <FaShoppingCart size={20} style={{ color: "#FA8C16" }} />
            </Nav.Link>

            <Dropdown show={showMenu} onToggle={setShowMenu}>
              <Dropdown.Toggle
                as={FaUserCircle}
                size={22}
                style={{
                  color: "#FA8C16",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                }}
                className="mx-2"
              />
              <Dropdown.Menu align="end">
                {!isAuthenticated ? (
                  <Dropdown.Item onClick={() => navigate("/profile")}>
                    <FaSignInAlt className="me-2" /> Login
                  </Dropdown.Item>
                ) : (
                  <>
                    <Dropdown.Item onClick={() => navigate(getDashboardPath())}>
                      <FaUserCircle className="me-2" /> Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Logout
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
