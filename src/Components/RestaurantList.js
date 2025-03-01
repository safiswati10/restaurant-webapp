import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import RestaurantMenu from "./RestaurantMenu";

const restaurants = [
  { id: 1, name: "Pizza Hut", image: "https://images.unsplash.com/photo-1621114957135-7f88c8447439?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 2, name: "McDonald's", image: "https://images.unsplash.com/photo-1621114957135-7f88c8447439?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 3, name: "KFC", image: "https://images.unsplash.com/photo-1621114957135-7f88c8447439?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 4, name: "Subway", image: "https://images.unsplash.com/photo-1621114957135-7f88c8447439?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 5, name: "Domino's Pizza", image: "https://images.unsplash.com/photo-1621114957135-7f88c8447439?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 6, name: "Starbucks", image: "https://images.unsplash.com/photo-1621114957135-7f88c8447439?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

const RestaurantList = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  return (
    <Container className="mt-5">
      {selectedRestaurant ? (
        <RestaurantMenu restaurantName={selectedRestaurant} onBack={() => setSelectedRestaurant(null)} />
      ) : (
        <>
          <h2 className="text-center mb-4 fw-bold">Popular Restaurants</h2>
          <Row>
            {restaurants.map((restaurant) => (
              <Col key={restaurant.id} md={4} sm={6} xs={12} className="mb-4">
                <Card className="shadow">
                  <Card.Img variant="top" src={restaurant.image} alt={restaurant.name} />
                  <Card.Body>
                    <Card.Title className="fw-semibold">{restaurant.name}</Card.Title>
                    <Button
                      style={{ backgroundColor: "#FA8C16", border: "none" }}
                      className="w-100"
                      onClick={() => setSelectedRestaurant(restaurant.name)}
                    >
                      View Menu
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default RestaurantList;
