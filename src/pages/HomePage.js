import React from "react";
import { Container } from "react-bootstrap";
import Hero from "../Components/Hero";
import RestaurantList from "../Components/RestaurantList";
import Cuisines from "../Components/Cuisines";
import FeaturedRestaurants from "../Components/FeaturedRestaurants";
import SpecialDeals from "../Components/SpecialDeals";
import "../styles/HomePage.css"; 

const HomePage = () => {
  return (
    <>
      <Hero />
      <Cuisines />
      <RestaurantList />
      <FeaturedRestaurants />
      <SpecialDeals />
    </>
  );
};

export default HomePage;
