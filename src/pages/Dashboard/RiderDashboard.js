import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const RiderDashboard = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
    vehicle_type: "",
    vehicle_number: "",
    account_holder_name: "",
    account_number: "",
    iban: "",
    bank_name: "",
    joining_date: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState("profile");
  const [notifications, setNotifications] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const primaryColor = "#FA8C16";
  const primaryHoverColor = "#e67e0d";
  const textColor = "#333";

  useEffect(() => {
    const fetchRiderProfile = async () => {
      try {
        const riderId = localStorage.getItem("userId");
        console.log("Current rider ID:", riderId);

        if (!riderId) throw new Error("No rider ID found");

        console.log("Fetching rider data from API...");
        const response = await fetch(
          `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/riders/rider-list`
        );

        if (!response.ok) throw new Error("Failed to fetch rider data");

        const { data } = await response.json();
        console.log("API data received:", data);

        const riderData = data.find((rider) => rider._id === riderId);
        console.log("Matched rider data:", riderData);

        if (!riderData) {
          throw new Error("Rider data not found in API response");
        }

        setProfile({
          name: riderData.name || "Not available",
          phone: riderData.phone || "Not available",
          vehicle_type: riderData.vehicle_type || "Not available",
          vehicle_number: riderData.vehicle_number || "Not available",
          joining_date: riderData.joining_date
            ? new Date(riderData.joining_date).toISOString().split("T")[0]
            : "Not available",
          // Fix for address object issue - use the text property if it exists
          address: (typeof riderData.address === 'object' ? riderData.address.text : riderData.address) || "Not available",
          account_holder_name: riderData.account_holder_name || "Not available",
          account_number: riderData.account_number || "Not available",
          iban: riderData.iban || "Not available",
          bank_name: riderData.bank_name || "Not available",
        });

        setLoading(false);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRiderProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const riderId = localStorage.getItem("userId");
      
      if (!riderId) throw new Error("No rider ID found");

      const response = await fetch(
        `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/riders/update-rider/${riderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedData = await response.json();
      console.log("Profile updated successfully:", updatedData);
      
      setUpdateSuccess(true);
      setEditMode(false);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: "Completed" } : order
      )
    );
  };

  const handleCancelOrder = (id, reason) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: "Canceled", reason } : order
      )
    );
  };

  const handleAcceptOrder = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: "Accepted" } : order
      )
    );
  };

  const handleRejectOrder = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: "Rejected" } : order
      )
    );
  };

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="spinner-border"
          style={{ color: primaryColor }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4">
        <p>{error}</p>
        <button
          className="btn"
          onClick={() => navigate("/")}
          style={{
            backgroundColor: primaryColor,
            color: "white",
            borderColor: primaryColor,
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <div
        className="sidebar bg-dark text-white p-4"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <h4 className="text-center mb-4">Rider Dashboard</h4>
        <ul className="list-unstyled">
          {["profile", "orders", "notifications"].map((tab) => (
            <li className="mb-2" key={tab}>
              <button
                className="btn w-100 text-start"
                onClick={() => setSelectedTab(tab)}
                style={{
                  backgroundColor:
                    selectedTab === tab ? primaryColor : "#6c757d",
                  color: "white",
                  borderColor: selectedTab === tab ? primaryColor : "#6c757d",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => {
                  if (selectedTab !== tab) {
                    e.target.style.backgroundColor = primaryHoverColor;
                    e.target.style.borderColor = primaryHoverColor;
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedTab !== tab) {
                    e.target.style.backgroundColor = "#6c757d";
                    e.target.style.borderColor = "#6c757d";
                  }
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="container mt-4 w-100">
        {updateSuccess && (
          <div className="alert alert-success">
            Profile updated successfully!
          </div>
        )}
        
        <h2 className="text-center mb-4" style={{ color: primaryColor }}>
          {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
        </h2>

        {selectedTab === "profile" && (
          <div className="text-center">
            <div className="d-flex justify-content-end mb-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleUpdateProfile}
                    className="btn me-2"
                    style={{
                      backgroundColor: primaryColor,
                      color: "white",
                      borderColor: primaryColor,
                    }}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="btn"
                  style={{
                    backgroundColor: primaryColor,
                    color: "white",
                    borderColor: primaryColor,
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            <h3 style={{ color: textColor }}>Profile Information</h3>
            <div className="row justify-content-center">
              <div className="col-md-6 text-start">
                <h5 className="mt-4 mb-3" style={{ color: primaryColor }}>
                  Personal Information
                </h5>
                <div className="mb-3">
                  <p>
                    <strong>Full Name:</strong>{" "}
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    ) : (
                      profile.name
                    )}
                  </p>
                  <p>
                    <strong>Phone Number:</strong>{" "}
                    {editMode ? (
                      <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    ) : (
                      profile.phone
                    )}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {editMode ? (
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    ) : (
                      profile.address
                    )}
                  </p>
                </div>

                <h5 className="mt-4 mb-3" style={{ color: primaryColor }}>
                  Vehicle Information
                </h5>
                <div className="mb-3">
                  <p>
                    <strong>Vehicle Type:</strong>{" "}
                    {editMode ? (
                      <select
                        name="vehicle_type"
                        value={profile.vehicle_type}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Bicycle">Bicycle</option>
                        <option value="Car">Car</option>
                        <option value="Scooter">Scooter</option>
                      </select>
                    ) : (
                      profile.vehicle_type
                    )}
                  </p>
                  <p>
                    <strong>Vehicle Number:</strong>{" "}
                    {editMode ? (
                      <input
                        type="text"
                        name="vehicle_number"
                        value={profile.vehicle_number}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    ) : (
                      profile.vehicle_number
                    )}
                  </p>
                </div>

                <h5 className="mt-4 mb-3" style={{ color: primaryColor }}>
                  Bank Account Details
                </h5>
                <div className="mb-3">
                  <p>
                    <strong>Account Holder Name:</strong>{" "}
                    {editMode ? (
                      <input
                        type="text"
                        name="account_holder_name"
                        value={profile.account_holder_name}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    ) : (
                      profile.account_holder_name
                    )}
                  </p>
                  <p>
                    <strong>Account Number:</strong>{" "}
                    {editMode ? (
                      <input
                        type="text"
                        name="account_number"
                        value={profile.account_number}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    ) : (
                      profile.account_number
                    )}
                  </p>
                  <p>
                    <strong>IBAN:</strong>{" "}
                    {editMode ? (
                      <input
                        type="text"
                        name="iban"
                        value={profile.iban}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    ) : (
                      profile.iban
                    )}
                  </p>
                  <p>
                    <strong>Bank Name:</strong>{" "}
                    {editMode ? (
                      <input
                        type="text"
                        name="bank_name"
                        value={profile.bank_name}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    ) : (
                      profile.bank_name
                    )}
                  </p>
                </div>

                {profile.joining_date && (
                  <>
                    <h5 className="mt-4 mb-3" style={{ color: primaryColor }}>
                      Membership
                    </h5>
                    <p>
                      <strong>Joining Date:</strong> {profile.joining_date}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTab === "orders" && (
          <>
            <h3 style={{ color: textColor }}>Orders</h3>
            {orders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Restaurant</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.restaurantName}</td>
                        <td>{order.userLocation}</td>
                        <td>{order.status}</td>
                        <td>
                          {order.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleAcceptOrder(order.id)}
                                className="btn btn-success me-2"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectOrder(order.id)}
                                className="btn btn-danger"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {order.status === "Accepted" && (
                            <>
                              <button
                                onClick={() => handleCompleteOrder(order.id)}
                                className="btn btn-success me-2"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt(
                                    "Reason for cancellation:"
                                  );
                                  if (reason)
                                    handleCancelOrder(order.id, reason);
                                }}
                                className="btn btn-danger"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {order.status === "Canceled" && (
                            <span className="text-danger">
                              Canceled: {order.reason}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No orders available</p>
            )}
          </>
        )}

        {selectedTab === "notifications" && (
          <>
            <h3 style={{ color: textColor }}>Notifications</h3>
            <div className="list-group">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="list-group-item"
                    style={{
                      backgroundColor: notification.read
                        ? "#f8f9fa"
                        : `rgba(250, 140, 22, 0.1)`,
                      borderLeft: notification.read
                        ? "none"
                        : `4px solid ${primaryColor}`,
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{notification.message}</span>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="btn btn-sm"
                          style={{
                            backgroundColor: primaryColor,
                            color: "white",
                            borderColor: primaryColor,
                          }}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No notifications</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;