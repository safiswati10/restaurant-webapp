import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCategoryImage = (categoryName) => {
    const formattedName = categoryName.toLowerCase().replace(/\s+/g, "+");
    return `https://source.unsplash.com/300x300/?${formattedName},food`;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/menus/menu-list"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        if (!Array.isArray(data?.data)) {
          throw new Error("Invalid data format received");
        }

        const uniqueCategories = [
          ...new Set(
            data.data.map((item) => item.category?.trim()).filter(Boolean)
          ),
        ];

        const categoryList = uniqueCategories.map((category) => ({
          name: category,
          image: getCategoryImage(category),
        }));

        setCategories(categoryList);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName.toLowerCase()}`);
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2">Loading categories...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Error loading categories: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="fw-bold mb-4" style={{ color: "#FA8C16" }}>
        Categories
      </h2>
      <Row className="g-3">
        {categories.map((category, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-3">
            <Card
              className="h-100 shadow-sm border-0"
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onClick={() => handleCategoryClick(category.name)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Card.Img
                variant="top"
                src={category.image}
                alt={category.name}
                style={{ height: "150px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "https://source.unsplash.com/300x300/?food";
                }}
              />
              <Card.Body className="p-3">
                <Card.Title
                  className="fw-semibold mb-0"
                  style={{ fontSize: "1rem" }}
                >
                  {category.name}
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategoriesPage;
