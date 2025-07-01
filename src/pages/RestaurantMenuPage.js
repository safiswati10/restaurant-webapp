import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RestaurantMenu from "../Components/RestaurantMenu";

const RestaurantMenuPage = () => {
  const { id, name } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(
          `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/restaurants/restaurant-list`
        );
        const data = await response.json();
        const found = (data.data || data).find((r) => r._id === id);
        setRestaurant(found);
      } catch (error) {
        console.error("Error loading restaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <p className="text-center py-5">Loading menu...</p>;
  if (!restaurant) return <p className="text-center py-5">Menu not found</p>;

  return <RestaurantMenu restaurantName={restaurant.name} restaurantId={restaurant._id} onBack={() => window.history.back()} />;
};
 
export default RestaurantMenuPage;
