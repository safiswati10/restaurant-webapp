import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../Redux/cartSlice";
import CartSidebar from "./CartSidebar";
import { FaTrash } from "react-icons/fa";

const API_BASE_URL = "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app";
const FALLBACK_IMAGE = "https://placehold.co/600x400?text=No+Image";

const RestaurantMenu = ({ restaurantName, restaurantId, onBack }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/web/api/menus/menu-list`);
        if (!response.ok)
          throw new Error(`Failed to fetch menu: ${response.status}`);
        const data = await response.json();

        if (data.status === 1) {
          const processedMenu = data.data
            .filter((item) => item.restaurantId === restaurantId)
            .map((item) => ({
              ...item,
              image: getImageUrl(item.image),
            }));
          setMenu(processedMenu);
        } else {
          throw new Error(data.message || "Menu data not available");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return FALLBACK_IMAGE;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads/")) return `${API_BASE_URL}${imagePath}`;
    return `${API_BASE_URL}/uploads/${imagePath.replace(/^\/+/, "")}`;
  };

  const isItemInCart = (itemId) => cartItems.some((item) => item.id === itemId);

  const handleAddItem = (item) =>
    dispatch(addToCart({ 
      ...item, 
      quantity: 1, 
      id: item._id,
      restaurantId,
      restaurantName
    }));

  const handleRemoveItem = (itemId) => dispatch(removeFromCart(itemId));

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" variant="warning" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-danger">{error}</div>
        <Button
          variant="warning"
          onClick={() => window.location.reload()}
          className="text-white"
        >
          Try Again
        </Button>
      </Container>
    );
  }

  if (menu.length === 0) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center py-5"
        style={{ minHeight: "50vh" }}
      >
        <div
          className="text-center"
          style={{ color: "#FA8C16", fontSize: "1.5rem", fontWeight: "bold" }}
        >
          Sorry, no menu available for this restaurant.
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="px-md-4 px-3 py-3">
      <Row className="align-items-center mb-3">
        <Col xs={8}>
          <h2 className="fw-bold text-warning mb-0">{restaurantName}</h2>
        </Col>
        <Col xs={4} className="text-end">
          <Button
            variant="outline-warning"
            size="sm"
            onClick={onBack}
            className="px-3"
            style={{
              backgroundColor: "#FA8C16",
              borderColor: "#FA8C16",
              color: "white",
            }}
          >
            Back
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={8} lg={9} className="pe-lg-4">
          <Row className="g-3">
            {menu.map((item) => (
              <Col key={item._id} xs={12} sm={6} md={6} lg={4} xl={3}>
                <Card className="h-100 border-0 shadow-sm hover-effect">
                  <div className="ratio ratio-1x1 bg-light">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid object-fit-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                      loading="lazy"
                    />
                  </div>

                  <Card.Body className="d-flex flex-column p-3">
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-1 text-truncate">
                        {item.name}
                      </h5>
                      <p className="text-success fw-bold mb-2">
                        Rs. {item.price}
                      </p>
                      {item.description && (
                        <p
                          className="text-muted small mb-3 line-clamp-2"
                          style={{ WebkitLineClamp: 2 }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                    {isItemInCart(item._id) ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveItem(item._id)}
                        className="w-100 py-2"
                      >
                        <FaTrash className="me-1" /> Remove
                      </Button>
                    ) : (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleAddItem(item)}
                        style={{
                          backgroundColor: "#FA8C16",
                          borderColor: "#FA8C16",
                          color: "white",
                        }}
                        className="w-100 py-2"
                      >
                        Add to Cart
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col xs={12} md={4} lg={3} className="mt-4 mt-md-0">
          <CartSidebar />
        </Col>
      </Row>
      <style jsx>{`
        .hover-effect:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
        .object-fit-cover {
          object-fit: cover;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Container>
  );
};

export default RestaurantMenu;