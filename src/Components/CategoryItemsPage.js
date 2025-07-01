import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../Redux/cartSlice";
import CartSidebar from "./CartSidebar";
import { FaTrash } from "react-icons/fa";

const API_BASE_URL = "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app";
const FALLBACK_IMAGE = "https://placehold.co/600x400?text=No+Image";

const CategoryItemsPage = () => {
  const { categoryName } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/web/api/menus/menu-list`);
        if (!response.ok) throw new Error("Failed to fetch menu items");
        const data = await response.json();
        if (data.status !== 1) throw new Error("Invalid menu data");
        const filteredItems = data.data.filter(
          (item) => item.category?.trim().toLowerCase() === categoryName.toLowerCase()
        ).map((item) => ({ ...item, image: getImageUrl(item.image) }));
        setItems(filteredItems);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching menu items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, [categoryName]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return FALLBACK_IMAGE;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads/")) return `${API_BASE_URL}${imagePath}`;
    return `${API_BASE_URL}/uploads/${imagePath.replace(/^\/+/g, "")}`;
  };

  const isItemInCart = (itemId) => cartItems.some((item) => item.id === itemId);

  if (loading) return (<Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}><Spinner animation="border" variant="warning" /></Container>);
  if (error) return (<Container className="text-center py-5"><Alert variant="danger">{error}</Alert></Container>);

  return (
    <Container fluid className="px-md-4 px-3 py-3">
      <h2 className="fw-bold text-warning mb-4">{categoryName} Items</h2>
      <Row>
        <Col xs={12} md={8} lg={9} className="pe-lg-4">
          <Row className="g-3">
            {items.length > 0 ? items.map((item) => (
              <Col key={item._id} xs={12} sm={6} md={6} lg={4} xl={3}>
                <Card className="h-100 border-0 shadow-sm hover-effect">
                  <div className="ratio ratio-1x1 bg-light">
                    <img src={item.image} alt={item.name} className="img-fluid object-fit-cover" loading="lazy" />
                  </div>
                  <Card.Body className="d-flex flex-column p-3">
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-1 text-truncate">{item.name}</h5>
                      <p className="text-success fw-bold mb-2">Rs. {item.price}</p>
                      <p className="text-muted small mb-3 line-clamp-2">{item.description || "Tasty and delicious food!"}</p>
                    </div>
                    {isItemInCart(item._id) ? (
                      <Button variant="danger" size="sm" onClick={() => dispatch(removeFromCart(item._id))} className="w-100 py-2">
                        <FaTrash className="me-1" /> Remove
                      </Button>
                    ) : (
                      <Button variant="warning" size="sm" onClick={() => dispatch(addToCart({ ...item, quantity: 1, id: item._id }))} className="w-100 py-2">
                        Add to Cart
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            )) : <p className="text-muted">No items found for this category.</p>}
          </Row>
        </Col>
        <Col xs={12} md={4} lg={3} className="mt-4 mt-md-0">
          <CartSidebar />
        </Col>
      </Row>
      <style jsx>{`
        .hover-effect:hover { transform: translateY(-2px); transition: transform 0.2s ease; }
        .object-fit-cover { object-fit: cover; }
        .line-clamp-2 { display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </Container>
  );
};

export default CategoryItemsPage;