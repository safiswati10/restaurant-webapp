import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import RestaurantMenu from "./RestaurantMenu";

const FALLBACK_IMAGE =
  "https://img.freepik.com/free-vector/hand-drawn-chef-silhouette_23-2150609801.jpg?uid=R191773258&ga=GA1.1.1664888991.1731826981&semt=ais_hybrid";

const API_BASE_URL =
  "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app";

const FeaturedRestaurants = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const navigate = useNavigate();
  const fetchFeaturedRestaurants = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/web/api/featureRestaurants/featureRestaurant-list`
      );
      const data = await response.json();

      if (data.status === 1 && data.data) {
        const formattedRestaurants = data.data.map((restaurant) => ({
          ...restaurant,
          image: restaurant.image
            ? restaurant.image.startsWith("http")
              ? restaurant.image
              : restaurant.image.startsWith("/uploads/")
              ? `${API_BASE_URL}${restaurant.image}`
              : `${API_BASE_URL}/uploads/${restaurant.image.replace(
                  /^\/+/,
                  ""
                )}`
            : FALLBACK_IMAGE,
        }));
        setFeaturedRestaurants(formattedRestaurants);
      } else {
        setError("Invalid API response");
        console.error("Error: Invalid API response", data);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching featured restaurants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedRestaurants();
  }, []);

  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status" style={{ color: "#FA8C16" }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
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

  if (featuredRestaurants.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <p>No featured restaurants available at the moment.</p>
      </Container>
    );
  }

  if (selectedRestaurant) {
    return (
      <RestaurantMenu
        restaurantName={selectedRestaurant.name}
        restaurantId={selectedRestaurant._id}
        onBack={() => setSelectedRestaurant(null)}
      />
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4" style={{ color: "#FA8C16" }}>
        Featured Restaurants
      </h2>
      <Row>
        {featuredRestaurants.map((restaurant) => (
          <Col key={restaurant._id} md={4} className="mb-4">
            <Card className="restaurant-card h-100">
              <div style={{ height: "200px", overflow: "hidden" }}>
                <Card.Img
                  variant="top"
                  src={restaurant.image}
                  className="restaurant-img h-100 w-100"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-dark d-flex justify-content-between align-items-center">
                  {restaurant.name}
                  <span
                    className="badge text-light"
                    style={{ backgroundColor: "#FA8C16", border: "none" }}
                  >
                    {restaurant.rating || "4.5"} ★
                  </span>
                </Card.Title>
                <Card.Text className="text-muted">
                  Delivery: Rs. {restaurant.deliveryFee || "50"}
                </Card.Text>
                {restaurant.discount && (
                  <Card.Text className="text-success fw-semibold">
                    {restaurant.discount}% Off
                  </Card.Text>
                )}
                <Button
                  variant="warning"
                  className="w-100 mt-auto"
                  style={{
                    backgroundColor: "#FA8C16",
                    border: "none",
                    color: "white",
                  }}
                  onClick={() => {
                    navigate(
                      `/restaurant/${restaurant._id}/${encodeURIComponent(
                        restaurant.name
                      )}`
                    );
                  }}
                >
                  View Menu
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FeaturedRestaurants;
