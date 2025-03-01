import React from "react";
import { Container, Button } from "react-bootstrap";

const Hero = () => {
  return (
    <div className="hero-section d-flex align-items-center">
      <Container className="text-center text-white">
        <h1 className="display-4 fw-bold">Your favorite food, delivered</h1>
        <p className="fs-5">Order from the best restaurants near you.</p>
        <Button variant="light"  style={{color:"#FA8C16"}} className="fw-bold  px-4 py-2">Order Now</Button>
      </Container>
    </div>
  );
};

export default Hero;
