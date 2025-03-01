import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import menuData from "../data/MenuData";

const RestaurantMenu = ({ restaurantName, onBack }) => {
  const menu = menuData[restaurantName] || [];

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4 fw-bold">{restaurantName} Menu</h2>
      <Row>
        {menu.length > 0 ? (
          menu.map((item) => (
            <Col key={item.id} md={4} sm={6} xs={12} className="mb-4">
              <Card className="shadow">
                <Card.Img variant="top" src={item.image} alt={item.name} />
                <Card.Body>
                  <Card.Title className="fw-semibold">{item.name}</Card.Title>
                  <Card.Text className="fw-bold text-success">{item.price}</Card.Text>
                  <Button style={{ backgroundColor: "#FA8C16", border: "none" }}>
                    Order Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">Menu not available</p>
        )}
      </Row>
      <Button variant="secondary" onClick={onBack} className="mt-3">
        Back to Restaurants
      </Button>
    </Container>
  );
};

export default RestaurantMenu;
