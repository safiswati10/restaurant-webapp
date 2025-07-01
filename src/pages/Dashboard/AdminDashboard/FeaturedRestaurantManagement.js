import React, { useState, useEffect } from "react";

const FeaturedRestaurantManagement = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState({
    featured: false,
    actions: false,
  });

  const fetchFeaturedRestaurants = async () => {
    setIsLoading((prev) => ({ ...prev, featured: true }));
    try {
      const response = await fetch(
        "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/featureRestaurants/featureRestaurant-list"
      );
      const data = await response.json();

      console.log("API Response:", data);

      if (data.status === 1 && data.data) {
        setFeaturedRestaurants(data.data);
      } else {
        console.error("Invalid API Response", data);
      }
    } catch (error) {
      console.error("Error fetching featured restaurants:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, featured: false }));
    }
  };

  const handleRemoveFeatured = async (restaurantId) => {
    setIsLoading((prev) => ({ ...prev, actions: true }));
    try {
      const response = await fetch(
        `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/featureRestaurants/delete-featureRestaurant/${restaurantId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setFeaturedRestaurants((prev) =>
          prev.filter((restaurant) => restaurant._id !== restaurantId)
        );
        alert("Restaurant removed from featured successfully");
      } else {
        alert("Failed to remove restaurant from featured");
      }
    } catch (error) {
      console.error("Error removing featured restaurant:", error);
      alert("Failed to remove restaurant from featured");
    } finally {
      setIsLoading((prev) => ({ ...prev, actions: false }));
    }
  };

  useEffect(() => {
    fetchFeaturedRestaurants();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Featured Restaurants List</h2>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header bg-success text-white">
              Featured Restaurants
            </div>
            <div className="card-body">
              {isLoading.featured ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-success"></div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {featuredRestaurants.map((r) => (
                        <tr key={r._id}>
                          <td>{r.name}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRemoveFeatured(r._id)}
                              disabled={isLoading.actions}
                            >
                              {isLoading.actions ? (
                                <div className="spinner-border spinner-border-sm text-light"></div>
                              ) : (
                                "Remove from Featured"
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedRestaurantManagement;
