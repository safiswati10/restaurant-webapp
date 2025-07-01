import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import RestaurantMenu from "../Components/RestaurantMenu";
import "../styles/RestaurantsPage.css";
import { useNavigate } from "react-router-dom";


const FALLBACK_IMAGE =
  "https://img.freepik.com/free-vector/hand-drawn-chef-silhouette_23-2150609801.jpg?uid=R191773258&ga=GA1.1.1664888991.1731826981&semt=ais_hybrid";

const RestaurantsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/restaurants/restaurant-list"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging

        // Handle different possible response structures
        let restaurantsArray = [];

        if (Array.isArray(data)) {
          restaurantsArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          restaurantsArray = data.data;
        } else if (data.restaurants && Array.isArray(data.restaurants)) {
          restaurantsArray = data.restaurants;
        }

        // Add proper image URLs and fallbacks
        restaurantsArray = restaurantsArray.map((restaurant) => ({
          ...restaurant,
          id:
            restaurant.id ||
            restaurant._id ||
            `restaurant-${Math.random().toString(36).substr(2, 9)}`,
          image: restaurant.image
            ? restaurant.image.startsWith("http")
              ? restaurant.image
              : `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/uploads/${restaurant.image}`
            : FALLBACK_IMAGE,
        }));

        setRestaurants(restaurantsArray);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <Alert variant="danger">
          <p>Error loading restaurants: {error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="restaurants-page">
      <section className="hero-section text-center text-white py-5">
        <h1>Discover the Best Restaurants</h1>
        <p>Find your favorite food from top-rated restaurants</p>
        <Form className="search-bar mt-4">
          <Form.Control
            type="text"
            placeholder="Search Restaurants..."
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </Form>
      </section>

      <Container className="mt-5">
        {selectedRestaurant ? (
          <RestaurantMenu
            restaurant={selectedRestaurant}
            onBack={() => setSelectedRestaurant(null)}
          />
        ) : (
          <>
            <Row>
              {filteredRestaurants.map((restaurant) => (
                <Col key={restaurant.id} md={4} className="mb-4">
                  <Card className="restaurant-card shadow">
                    <div
                      className="image-container"
                      style={{ height: "200px", overflow: "hidden" }}
                    >
                      <img
                        src={restaurant.image}
                        alt={restaurant.name || "Restaurant"}
                        className="card-img-top h-100 w-100"
                        style={{ objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = FALLBACK_IMAGE;
                          e.target.alt = "Fallback restaurant image";
                        }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="fw-semibold d-flex justify-content-between align-items-center">
                        {restaurant.name || "Restaurant"}
                        <span
                          className="badge text-light"
                          style={{ backgroundColor: "#FA8C16", border: "none" }}
                        >
                          {restaurant.rating || "4.0"} ★
                        </span>
                      </Card.Title>
                      <p className="text-muted mb-1">
                        Delivery: Rs.{" "}
                        {restaurant.delivery_fee || restaurant.delivery || "50"}
                      </p>
                      {restaurant.offer && (
                        <p className="text-success fw-semibold">
                          {restaurant.offer}
                        </p>
                      )}
                      <Button
                        style={{ backgroundColor: "#FA8C16", border: "none" }}
                        className="w-100"
                        onClick={() =>
                          navigate(
                            `/restaurant/${restaurant._id}/${encodeURIComponent(
                              restaurant.name
                            )}`
                          )
                        }
                      >
                        View Menu
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            {filteredRestaurants.length === 0 && (
              <div className="text-center py-5">
                <p>No restaurants found matching your search</p>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default RestaurantsPage;
