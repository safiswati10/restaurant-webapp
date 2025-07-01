import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Cuisines = () => {
  const navigate = useNavigate();
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUnsplashImage = (category) =>
    `https://source.unsplash.com/200x200/?${encodeURIComponent(category)},food`;

  const fallbackImage =
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D";

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await fetch(
          "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/menus/menu-list"
        );

        if (!response.ok) throw new Error("Failed to fetch cuisines");

        const data = await response.json();

        if (!Array.isArray(data?.data)) throw new Error("Invalid data format");

        const categories = [
          ...new Set(data.data.map((item) => item.category?.trim())),
        ].filter(Boolean);

        const cuisineList = categories.map((category) => ({
          name: category,
          image: getUnsplashImage(category),
        }));

        setCuisines(cuisineList);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching cuisines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCuisines();
  }, []);

  // 🛠 Function to navigate to selected cuisine page
  const handleCuisineClick = (cuisineName) => {
    navigate(`/category/${encodeURIComponent(cuisineName.toLowerCase())}`);
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

  if (error) {
    return (
      <Container className="my-5 text-center">
        <div className="alert alert-danger">Error: {error}</div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center fw-bold mb-4" style={{ color: "#FA8C16" }}>
        Explore Popular Cuisines
      </h2>

      {cuisines.length > 0 ? (
        <Swiper
          modules={[Autoplay]}
          slidesPerView={2}
          spaceBetween={10}
          autoplay={{ delay: 2500 }}
          loop={true}
          breakpoints={{
            480: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
          }}
          className="pb-5"
        >
          {cuisines.map((cuisine, index) => (
            <SwiperSlide key={index} className="text-center">
              <div
                onClick={() => handleCuisineClick(cuisine.name)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={cuisine.image}
                  alt={cuisine.name}
                  className="shadow-sm"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = fallbackImage;
                  }}
                />
                <p className="mt-2 fw-semibold">{cuisine.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-muted">No cuisines found</p>
      )}
    </Container>
  );
};

export default Cuisines;
