import React, { useState, useEffect } from "react";

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState({
    all: [],
    pending: [],
  });
  const [filter, setFilter] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const renderAddress = (address) => {
    if (!address) return "No address";
    if (typeof address === "string") return address;
    return address.text || JSON.stringify(address);
  };

  // Helper function to transform backend data to frontend format
 const transformRestaurantData = (data) => {
  const API_BASE_URL = "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app";
  const FALLBACK_IMAGE = "https://img.freepik.com/free-vector/hand-drawn-chef-silhouette_23-2150609801.jpg";

  return data.map(restaurant => ({
    ...restaurant,
    ownerName: restaurant.owner_name,
    ownerPhone: restaurant.owner_phone,
    ownerEmail: restaurant.owner_email,
    rating: restaurant.ratings || 0,
    order: restaurant.orders || 0,
    image: restaurant.image
      ? restaurant.image.startsWith("http")
        ? restaurant.image
        : restaurant.image.startsWith("/uploads/")
        ? `${API_BASE_URL}${restaurant.image}`
        : `${API_BASE_URL}/uploads/${restaurant.image.replace(/^\/+/, "")}`
      : FALLBACK_IMAGE
  }));
};

  useEffect(() => {
    const fetchAllRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [resAll, resPending] = await Promise.all([
          fetch("https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/restaurants/restaurant-list"),
          fetch("https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/pendingRestaurants/pendingRestaurant-list")
        ]);

        const [dataAll, dataPending] = await Promise.all([
          resAll.json(),
          resPending.json()
        ]);

        if (dataAll.status === 1 && dataPending.status === 1) {
          setRestaurants({
            all: transformRestaurantData(dataAll.data),
            pending: transformRestaurantData(dataPending.data),
          });
        } else {
          throw new Error("Invalid response data from server");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRestaurants();
  }, []);

  const handleDeleteRestaurant = async (restaurantId, isPending = false) => {
    try {
      const apiUrl = isPending
        ? `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/pendingRestaurants/delete-pendingRestaurant/${restaurantId}`
        : `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/restaurants/delete-restaurant/${restaurantId}`;

      const response = await fetch(apiUrl, { method: "DELETE" });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete restaurant");
      }

      setRestaurants((prev) => ({
        all: prev.all.filter((r) => r._id !== restaurantId),
        pending: prev.pending.filter((r) => r._id !== restaurantId),
      }));

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Failed to delete restaurant: ${error.message}`);
    }
  };

  const handleApproveRestaurant = async (restaurantId) => {
    try {
      const pendingRestaurant = restaurants.pending.find(r => r._id === restaurantId);
      if (!pendingRestaurant) {
        throw new Error("Pending restaurant not found");
      }
  
      const restaurantData = {
        name: pendingRestaurant.name,
        phone: pendingRestaurant.phone,
        ratings: pendingRestaurant.rating || 0,
        address: pendingRestaurant.address?.text || pendingRestaurant.address || "No address",
        owner_name: pendingRestaurant.ownerName,
        owner_phone: pendingRestaurant.ownerPhone,
        owner_email: pendingRestaurant.ownerEmail,
        type: pendingRestaurant.type,
        orders: pendingRestaurant.order || 0,
        status: "approved",
        location: pendingRestaurant.location || { type: "Point", coordinates: [0, 0] },
        image: pendingRestaurant.image,
        password: pendingRestaurant.password || "default123",
        retypePassword: pendingRestaurant.retypePassword || "default123"
      };
  
      // Step 1: Create the restaurant in the main table
      const createResponse = await fetch(
        "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/restaurants/insert-restaurant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(restaurantData),
        }
      );
  
      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || `Server error: ${createResponse.status}`);
      }
  
      // Step 2: Delete from pending restaurants table
      const deleteResponse = await fetch(
        `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/pendingRestaurants/delete-pendingRestaurant/${restaurantId}`,
        { method: "DELETE" }
      );
  
      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        throw new Error(errorData.message || "Failed to delete from pending restaurants");
      }
  
      // Step 3: Update frontend state
      setRestaurants(prev => ({
        all: [...prev.all, { ...pendingRestaurant, _id: restaurantId }], // Add to all restaurants
        pending: prev.pending.filter(r => r._id !== restaurantId) // Remove from pending
      }));
  
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Approval error:", error);
      alert(`Approval failed: ${error.message}`);
    }
  };

  const handleFeatureRestaurant = async (restaurantId) => {
    try {
      const restaurant =
        restaurants.all.find((r) => r._id === restaurantId) ||
        restaurants.pending.find((r) => r._id === restaurantId);
  
      if (!restaurant) {
        throw new Error("Restaurant not found");
      }
  
      const formData = new FormData();
      formData.append("name", restaurant.name);
      formData.append("phone", restaurant.phone);
      formData.append("ratings", restaurant.rating || 0);
      formData.append("address", restaurant.address);
      formData.append("owner_name", restaurant.ownerName);
      formData.append("owner_phone", restaurant.ownerPhone);
      formData.append("owner_email", restaurant.ownerEmail);
      formData.append("type", restaurant.type);
      formData.append("orders", restaurant.order || 0);
  
      if (restaurant.location && restaurant.location.coordinates) {
        formData.append(
          "location.coordinates",
          JSON.stringify(restaurant.location.coordinates)
        );
      } else {
        formData.append("location.coordinates", JSON.stringify([0, 0]));
      }
  
      // Handle Image
      if (restaurant.image) {
        if (typeof restaurant.image === "string") {
          // If image is a string (URL), send it as is
          formData.append("image", restaurant.image);
        } else if (restaurant.image instanceof File) {
          // If image is a file, append it to formData
          formData.append("my_file", restaurant.image);
        }
      }
  
      // Use the actual restaurant ID in the URL
      const response = await fetch(
        `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/featureRestaurants/insert-featureRestaurant/${restaurantId}`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to feature restaurant");
      }
  
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      alert("Restaurant featured successfully!");
    } catch (error) {
      console.error("Feature error:", error);
      alert(`Failed to feature restaurant: ${error.message}`);
    }
  };
  
  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      const isPending = restaurants.pending.some((r) => r._id === itemToDelete);
      handleDeleteRestaurant(itemToDelete, isPending);
    }
    setIsDeleteModalOpen(false);
  };

  if (loading) {
    return <div className="text-center mt-4">Loading restaurants...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4">
        Error loading restaurants: {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Manage Restaurants</h2>

      <div className="d-flex gap-3 mb-3">
        <button
          className={`btn ${filter === "all" ? "btn-warning" : "btn-secondary"}`}
          onClick={() => setFilter("all")}
        >
          All Restaurants
        </button>
        <button
          className={`btn ${filter === "pending" ? "btn-warning" : "btn-secondary"}`}
          onClick={() => setFilter("pending")}
        >
          Pending Approval
        </button>
      </div>

      {restaurants[filter].length === 0 ? (
        <div className="alert alert-info">No restaurants found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Rating</th>
                <th>Address</th>
                <th>Owner Name</th>
                <th>Owner Phone</th>
                <th>Owner Email</th>
                <th>Type</th>
                <th>Order</th>
                {filter === "pending" && <th>Approved</th>}
                <th>Actions</th>
                {filter === "all" && <th>Feature</th>}
              </tr>
            </thead>
            <tbody>
              {restaurants[filter].map((restaurant) => (
                <tr key={restaurant._id}>
                  <td>{restaurant._id}</td>
                  <td>
                    {restaurant.image ? (
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        style={{ width: "50px", height: "50px" }}
                        className="img-thumbnail"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td>{restaurant.name || "N/A"}</td>
                  <td>{restaurant.phone || "N/A"}</td>
                  <td>{restaurant.rating || "N/A"}</td>
                  <td>{renderAddress(restaurant.address)}</td>
                  <td>{restaurant.ownerName || "N/A"}</td>
                  <td>{restaurant.ownerPhone || "N/A"}</td>
                  <td>{restaurant.ownerEmail || "N/A"}</td>
                  <td>{restaurant.type || "N/A"}</td>
                  <td>{restaurant.order || "N/A"}</td>
                  {filter === "pending" && (
                    <td>
                      <button
                        onClick={() => handleApproveRestaurant(restaurant._id)}
                        className="btn btn-success btn-sm"
                      >
                        Approve
                      </button>
                    </td>
                  )}
                  <td>
                    <button
                      onClick={() => handleDelete(restaurant._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                  {filter === "all" && (
                    <td>
                      <button
                        onClick={() => handleFeatureRestaurant(restaurant._id)}
                        className="btn btn-sm"
                        style={{ backgroundColor: "#fa8c16", color: "white" }}
                      >
                        Feature
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="btn-close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this restaurant?</p>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={confirmDelete} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div
          className="alert alert-success position-fixed top-0 end-0 m-3"
          style={{ zIndex: 1000 }}
        >
          Operation completed successfully!
        </div>
      )}
    </div>
  );
};

export default RestaurantManagement;