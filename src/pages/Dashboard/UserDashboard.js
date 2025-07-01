import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUser,
  FaShoppingCart,
  FaBell,
  FaEdit,
  FaSave,
  FaTimes
} from "react-icons/fa";

const UserDashboard = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedTab, setSelectedTab] = useState("profile");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      try {
        const res = await fetch(
          "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/users/user-list"
        );
        const result = await res.json();
        
        if (result.status === 1) {
          const currentUser = result.data.find((user) => user._id === userId);
          if (currentUser) {
            setProfile({
              name: currentUser.name || "",
              email: currentUser.email || "",
              address: (typeof currentUser.address === 'object' ? currentUser.address.text : currentUser.address) || "",
              phone: currentUser.phone || "",
            });
          }
        }
      } catch (error) {
        setError("Failed to fetch user data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(
        `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/users/update-user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            address: profile.address
          }),
        }
      );

      const result = await response.json();
      
      if (result.status === 1) {
        setSuccess("Profile updated successfully!");
        setEditMode(false);
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="d-flex">
      <div
        className="sidebar bg-dark text-white p-4"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <h4 className="text-center mb-4">User Dashboard</h4>
        <ul className="list-unstyled">
          {[
            { tab: "profile", icon: <FaUser /> },
            { tab: "orders", icon: <FaShoppingCart /> },
            { tab: "notifications", icon: <FaBell /> },
          ].map((item) => (
            <li className="mb-2" key={item.tab}>
              <button
                className={`btn w-100 text-start d-flex align-items-center ${
                  selectedTab === item.tab ? "btn-warning" : "btn-secondary"
                }`}
                onClick={() => setSelectedTab(item.tab)}
              >
                {item.icon}
                <span className="ms-2">
                  {item.tab.charAt(0).toUpperCase() + item.tab.slice(1)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="container mt-4 w-100">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        {selectedTab === "profile" && (
          <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Profile Information</h3>
              {editMode ? (
                <div>
                  <button 
                    className="btn btn-success me-2"
                    onClick={handleProfileUpdate}
                    disabled={loading}
                  >
                    <FaSave className="me-1" />
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setEditMode(false)}
                    disabled={loading}
                  >
                    <FaTimes className="me-1" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  className="btn btn-warning"
                  onClick={() => setEditMode(true)}
                >
                  <FaEdit className="me-1" />
                  Edit Profile
                </button>
              )}
            </div>

            <form>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <p className="form-control-plaintext">{profile.name}</p>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <p className="form-control-plaintext">{profile.email}</p>
                  )}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  {editMode ? (
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <p className="form-control-plaintext">{profile.phone}</p>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Address</label>
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <p className="form-control-plaintext">{profile.address}</p>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {selectedTab === "orders" && (
          <div className="card p-4">
            <h3 className="mb-4">Order History</h3>
            {orders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Restaurant</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.restaurantName}</td>
                        <td>{order.items.join(", ")}</td>
                        <td>{order.total}</td>
                        <td>
                          <span
                            className={`badge ${
                              order.status === "Delivered"
                                ? "bg-success"
                                : "bg-warning"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        )}

        {selectedTab === "notifications" && (
          <div className="card p-4">
            <h3 className="mb-4">Notifications</h3>
            {notifications.length > 0 ? (
              <ul className="list-group">
                {notifications.map((note) => (
                  <li
                    key={note.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {note.message}
                    <span className="badge bg-info text-dark">{note.date}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notifications found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;