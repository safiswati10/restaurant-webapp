import React, { useContext } from "react";
import { Card, Button, ListGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../Redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CartSidebar = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id: itemId, quantity }));
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const serviceFee = 50;
  const total = getSubtotal() + serviceFee;

  // Get restaurant details from the first item in cart
  const restaurantId = cartItems.length > 0 ? cartItems[0].restaurantId : null;
  const restaurantName = cartItems.length > 0 ? cartItems[0].restaurantName : "Restaurant";

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    navigate("/checkout", { 
      state: { 
        restaurantId,
        restaurantName 
      } 
    });
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate("/profile", { state: { fromCheckout: true } });
  };

  return (
    <>
      <Card
        className="shadow-sm"
        style={{ height: "400px", display: "flex", flexDirection: "column" }}
      >
        <Card.Header className="fw-bold bg-light">Your Cart</Card.Header>
        <Card.Body style={{ overflowY: "auto", flex: 1, padding: 0 }}>
          {cartItems.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <p className="text-muted">Your cart is empty.</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  className="d-flex justify-content-between align-items-center p-2"
                >
                  <div>
                    <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                      {item.name}
                    </span>
                    <br />
                    <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                      Rs. {item.price} x {item.quantity}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
        <Card.Footer
          className="bg-light"
          style={{ borderTop: "1px solid rgba(0,0,0,.125)" }}
        >
          <div className="d-flex flex-column gap-2">
            <div className="d-flex justify-content-between">
              <span className="fw-bold">Subtotal:</span>
              <span>Rs. {getSubtotal()}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="fw-bold">Service Fee:</span>
              <span>Rs. {serviceFee}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="fw-bold">Total (incl. fees and tax):</span>
              <span className="fw-bold text-success">Rs. {total}</span>
            </div>
            <Button
              variant="primary"
              className="w-100"
              style={{ backgroundColor: "#FA8C16", borderColor: "#FA8C16" }}
              onClick={handleProceedToCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </Card.Footer>
      </Card>

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You need to be logged in to proceed to checkout. Please login or create an account.
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
    </>
  );
};

export default CartSidebar;