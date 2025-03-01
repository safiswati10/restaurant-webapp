import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Hero from './Components/Hero';
import RestaurantList from './Components/RestaurantList';
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import DealsPage from './pages/DealsPage';
import CategoriesPage from './pages/CategoriesPage';
import TrackOrderPage from './pages/TrackOrderPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import ListYourResturant from "./pages/ListYourResturant";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <RestaurantList />
          </>
        } />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/ListYourResturant" element={<ListYourResturant />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
