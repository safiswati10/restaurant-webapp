import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  
  // Get restaurant details from location state
  const restaurantId = location.state?.restaurantId;
  const restaurantName = location.state?.restaurantName || "Restaurant";

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
  });
  const [showOrderPlaced, setShowOrderPlaced] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/users/user-list"
        );
        const result = await res.json();
        if (result.status === 1) {
          const currentUser = result.data.find((user) => user._id === userId);
          if (currentUser) {
            setUserDetails({
              name: currentUser.name || "",
              phone: currentUser.phone || ""
            });
            setAddress(
              currentUser.address && typeof currentUser.address === 'object' 
                ? currentUser.address.text 
                : currentUser.address || ""
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const serviceFee = 50;
  const deliveryFee = 0;
  const total = getSubtotal() + serviceFee + deliveryFee;

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setShowOrderPlaced(true);

    setTimeout(() => {
      navigate("/track-order", { 
        state: { 
          restaurantId,
          restaurantName,
          order: {
            id: Math.floor(Math.random() * 1000000).toString(),
            restaurantName,
            items: cartItems,
            subtotal: getSubtotal(),
            serviceFee,
            deliveryFee,
            total,
            timeline: [
              { step: "Order Placed", completed: true },
              { step: "Preparing", completed: false },
              { step: "Out for Delivery", completed: false },
              { step: "Delivered", completed: false },
            ]
          }
        } 
      });
    }, 2000);
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate("/profile", { state: { fromCheckout: true } });
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ color: "#FA8C16" }}>
        Checkout
      </h2>
      <Row>
        <Col md={6}>
          <Card
            className="mb-3"
            style={{
              border: "none",
              borderRadius: "10px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
              padding: "1.5rem",
            }}
          >
            <Card.Header
              className="fw-bold"
              style={{ backgroundColor: "#FA8C16", color: "#fff" }}
            >
              Your Order
            </Card.Header>
            <Card.Body>
              <h5>{restaurantName}</h5>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {item.quantity} x {item.name}
                  </span>
                  <span>Rs. {item.price * item.quantity}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>Rs. {getSubtotal()}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Service Fee:</span>
                <span>Rs. {serviceFee}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Delivery Fee:</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold">
                <span>Total (incl. fees and tax):</span>
                <span>Rs. {total}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card
            className="mb-3"
            style={{
              border: "none",
              borderRadius: "10px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
              padding: "1.5rem",
            }}
          >
            <Card.Header
              className="fw-bold"
              style={{ backgroundColor: "#FA8C16", color: "#fff" }}
            >
              Delivery Address
            </Card.Header>
            <Card.Body>
              <Form.Control
                as="textarea"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
              />
            </Card.Body>
          </Card>

          <Card
            className="mb-3"
            style={{
              border: "none",
              borderRadius: "10px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
              padding: "1.5rem",
            }}
          >
            <Card.Header
              className="fw-bold"
              style={{ backgroundColor: "#FA8C16", color: "#fff" }}
            >
              Payment Method
            </Card.Header>
            <Card.Body>
              <Form.Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option>Credit Card</option>
                <option>Cash on Delivery</option>
              </Form.Select>
            </Card.Body>
          </Card>

          <Card
            className="mb-3"
            style={{
              border: "none",
              borderRadius: "10px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
              padding: "1.5rem",
            }}
          >
            <Card.Header
              className="fw-bold"
              style={{ backgroundColor: "#FA8C16", color: "#fff" }}
            >
              User Details
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                  placeholder="Enter your name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={userDetails.phone}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                />
              </Form.Group>
            </Card.Body>
          </Card>

          <Button
            variant="primary"
            className="w-100"
            style={{
              backgroundColor: "#FA8C16",
              border: "none",
              padding: "10px 20px",
              fontWeight: "bold",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#e67700")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#FA8C16")}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </Col>
      </Row>

      <Modal show={showOrderPlaced} onHide={() => setShowOrderPlaced(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Order Placed</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your order has been placed successfully!</Modal.Body>
      </Modal>

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You need to be logged in to place an order. Please login or create an
          account.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            style={{ backgroundColor: "#FA8C16", border: "none" }}
            onClick={handleLoginRedirect}
          >
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CheckoutPage;