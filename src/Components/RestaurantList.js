import React, { useState, useEffect } from "react";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import RestaurantMenu from "./RestaurantMenu";
import "../styles/RestaurantList.css";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://img.freepik.com/free-vector/hand-drawn-chef-silhouette_23-2150609801.jpg?uid=R191773258&ga=GA1.1.1664888991.1731826981&semt=ais_hybrid";

const API_BASE_URL =
  "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app";

const RestaurantList = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/web/api/restaurants/restaurant-list`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }
        const data = await response.json();

        const restaurantsArray =
          data.restaurants || data.data || data.items || [];

        const topRestaurants = restaurantsArray
          .sort((a, b) => (b.orders || 0) - (a.orders || 0))
          .slice(0, 6)
          .map((restaurant) => ({
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

        setRestaurants(topRestaurants);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
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

  if (restaurants.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <p>No restaurants available</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {selectedRestaurant ? (
        <RestaurantMenu
          restaurantName={selectedRestaurant.name}
          restaurantId={selectedRestaurant.id}
          onBack={() => setSelectedRestaurant(null)}
        />
      ) : (
        <>
          <h2 className="text-center mb-4 fw-bold" style={{ color: "#FA8C16" }}>
            Popular Restaurants
          </h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={3}
            spaceBetween={20}
            navigation={false}
            pagination={{ clickable: true, el: ".custom-pagination" }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              480: { slidesPerView: 2 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-5"
          >
            {restaurants.map((restaurant) => (
              <SwiperSlide key={restaurant.id || restaurant._id}>
                {" "}
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
                      {restaurant.name}
                      <span
                        className="badge text-light"
                        style={{ backgroundColor: "#FA8C16", border: "none" }}
                      >
                        {restaurant.rating || "4.0"} ★
                      </span>
                    </Card.Title>
                    <p className="text-muted mb-1">
                      Delivery: Rs. {restaurant.deliveryFee || "50"}
                    </p>
                    {restaurant.discount && (
                      <p className="text-success fw-semibold">
                        {restaurant.discount}% Off
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
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="custom-pagination"></div>
        </>
      )}
    </Container>
  );
};

export default RestaurantList;
