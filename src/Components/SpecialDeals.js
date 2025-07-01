import React, { useState, useEffect, useContext } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Spinner,
  Modal 
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { addToCart } from "../Redux/cartSlice";

const SpecialDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(
          "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/deals/deal-list"
        );
        const data = await response.json();

        if (data.status === 1) {
          setDeals(data.data);
        } else {
          setError("Failed to fetch deals");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleOrderNow = (deal) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Add deal to cart as a special item
    const cartItem = {
      id: deal._id,
      name: deal.name,
      price: deal.price,
      quantity: 1,
      restaurantId: deal.restaurantId,
      restaurantName: deal.restaurantName || "Restaurant",
      isDeal: true,
      image: deal.image
    };

    dispatch(addToCart(cartItem));
    
    // Navigate to checkout with restaurant info
    navigate("/checkout", { 
      state: { 
        restaurantId: deal.restaurantId,
        restaurantName: deal.restaurantName || "Restaurant"
      } 
    });
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate("/profile", { state: { fromCheckout: true } });
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading deals...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 text-center">
        <p className="text-danger">Error: {error}</p>
      </Container>
    );
  }

  if (deals.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <p>No special deals available at the moment.</p>
      </Container>
    );
  }

  return (
    <>
      <Container className="mt-5">
        <h2 className="text-center mb-4 text-orange">
          Special Deals & Discounts
        </h2>
        <Row>
          {deals.map((deal) => (
            <Col key={deal._id} md={4} className="mb-4">
              <Card className="deal-card h-100">
                <Card.Img
                  variant="top"
                  src={`https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/uploads/${deal.image}`}
                  className="deal-img"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-dark">{deal.name}</Card.Title>
                  <Card.Text className="text-muted">{deal.description}</Card.Text>
                  <Card.Text className="mt-auto">
                    <strong>Discount: </strong> {deal.price}% OFF
                  </Card.Text>
                  <Button
                    variant="success"
                    className="w-100 mt-2"
                    style={{
                      backgroundColor: "#FA8C16",
                      border: "none",
                      color: "white",
                    }}
                    onClick={() => handleOrderNow(deal)}
                  >
                    Order Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You need to be logged in to order this deal. Please login or create an account.
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

export default SpecialDeals;