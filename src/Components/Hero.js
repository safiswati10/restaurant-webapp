import React, { useState } from "react";
import { Container, Button, FormControl, InputGroup } from "react-bootstrap";

const Hero = () => {
  const [address, setAddress] = useState("");

  const handleSearch = () => {
    if (!address) {
      alert("Please enter your address.");
      return;
    }
    console.log(`Searching for restaurants near: ${address}`);
  };

  return (
    <div className="hero-section d-flex align-items-center">
      <Container className="text-center text-white">
        <h1 className="hero-heading">Your favorite food, delivered</h1>
        <p className="hero-subtext">
          Order from the best restaurants near you.
        </p>

        <InputGroup className="hero-search mx-auto">
          <FormControl
            type="text"
            placeholder="Enter your address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-start hero-search-input"
          />
          <Button
            variant="light"
            className="fw-bold hero-search-btn"
            onClick={handleSearch}
          >
            Find Restaurants
          </Button>
        </InputGroup>
      </Container>
    </div>
  );
};

export default Hero;
