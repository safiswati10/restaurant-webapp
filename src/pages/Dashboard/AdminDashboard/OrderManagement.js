import React, { useState } from "react";

const OrderManagement = () => {
  const [orders, setOrders] = useState({
    completed: [
      {
        order_id: 1,
        distance: "5 km",
        restaurantName: "Pizza Hub",
        riderName: "John Doe",
        riderPhone: "5556667777",
        riderVehicleNum: "AB1234",
        deliveryCharges: "$5",
      },
    ],
    pending: [
      {
        order_id: 2,
        distance: "7 km",
        restaurantName: "Burger King",
        riderName: "Jane Doe",
        riderPhone: "5556668888",
        riderVehicleNum: "CD5678",
        deliveryCharges: "$7",
      },
    ],
    cancelled: [
      {
        order_id: 3,
        distance: "10 km",
        restaurantName: "Taco Bell",
        riderName: "John Smith",
        riderPhone: "5556669999",
        riderVehicleNum: "EF9101",
        deliveryCharges: "$10",
        cancellationReason: "Out of stock",
      },
    ],
  });
  const [filter, setFilter] = useState("completed");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setOrders((prevOrders) => ({
        completed: prevOrders.completed.filter(
          (order) => order.order_id !== itemToDelete
        ),
        pending: prevOrders.pending.filter(
          (order) => order.order_id !== itemToDelete
        ),
        cancelled: prevOrders.cancelled.filter(
          (order) => order.order_id !== itemToDelete
        ),
      }));
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <h2 className="text-center mb-4">Manage Orders</h2>

      <div className="d-flex gap-3 mb-3">
        <button
          className={`btn ${
            filter === "completed" ? "btn-warning" : "btn-secondary"
          }`}
          onClick={() => setFilter("completed")}
        >
          Completed Orders
        </button>
        <button
          className={`btn ${
            filter === "pending" ? "btn-warning" : "btn-secondary"
          }`}
          onClick={() => setFilter("pending")}
        >
          Pending Orders
        </button>
        <button
          className={`btn ${
            filter === "cancelled" ? "btn-warning" : "btn-secondary"
          }`}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled Orders
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Distance</th>
            <th>Restaurant Name</th>
            <th>Rider Name</th>
            <th>Rider Phone</th>
            <th>Rider Vehicle Number</th>
            <th>Delivery Charges</th>
            {filter === "cancelled" && <th>Cancellation Reason</th>}
          </tr>
        </thead>
        <tbody>
          {orders[filter].map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.distance || "N/A"}</td>
              <td>{order.restaurantName || "N/A"}</td>
              <td>{order.riderName || "N/A"}</td>
              <td>{order.riderPhone || "N/A"}</td>
              <td>{order.riderVehicleNum || "N/A"}</td>
              <td>{order.deliveryCharges || "N/A"}</td>
              {filter === "cancelled" && (
                <td>{order.cancellationReason || "No reason provided"}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isDeleteModalOpen && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
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
                <p>Are you sure you want to delete this order?</p>
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

      {showSuccessMessage && (
        <div
          className="alert alert-success position-fixed top-0 end-0 m-3"
          style={{ zIndex: 1000 }}
        >
          Operation completed successfully!
        </div>
      )}
    </>
  );
};

export default OrderManagement;
