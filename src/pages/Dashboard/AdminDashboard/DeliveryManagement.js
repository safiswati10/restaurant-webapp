import React, { useState } from "react";

const DeliveryManagement = () => {
  const [deliveryCharges, setDeliveryCharges] = useState([
    { id: 1, distance: "0-5 km", charges: "$5" },
    { id: 2, distance: "5-10 km", charges: "$10" },
  ]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [newDelivery, setNewDelivery] = useState({
    distance: "",
    charges: "",
  });

  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setDeliveryCharges((prevCharges) =>
        prevCharges.filter((charge) => charge.id !== itemToDelete)
      );
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
    setIsDeleteModalOpen(false);
  };

  const handleAddDelivery = () => {
    if (!newDelivery.distance || !newDelivery.charges) {
      alert("Please fill all fields");
      return;
    }
    const newEntry = { id: Date.now(), ...newDelivery };
    setDeliveryCharges([...deliveryCharges, newEntry]);
    setNewDelivery({ distance: "", charges: "" });
    setIsDeliveryModalOpen(false);
  };

  return (
    <>
      <h2 className="text-center mb-4">Manage Delivery Charges</h2>

      <button
        className="btn btn-warning mb-3"
        onClick={() => setIsDeliveryModalOpen(true)}
      >
        Add Delivery
      </button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Distance</th>
            <th>Charges</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveryCharges.map((charge) => (
            <tr key={charge.id}>
              <td>{charge.id}</td>
              <td>{charge.distance || "N/A"}</td>
              <td>{charge.charges || "N/A"}</td>
              <td>
                <button
                  onClick={() => handleDelete(charge.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
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
                <p>Are you sure you want to delete this delivery charge?</p>
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

      {isDeliveryModalOpen && (
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
                <h5 className="modal-title">Add Delivery Charges</h5>
                <button
                  onClick={() => setIsDeliveryModalOpen(false)}
                  className="btn-close"
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Distance (e.g., 0-5 km)"
                  value={newDelivery.distance}
                  onChange={(e) =>
                    setNewDelivery({ ...newDelivery, distance: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Charges (e.g., $5)"
                  value={newDelivery.charges}
                  onChange={(e) =>
                    setNewDelivery({ ...newDelivery, charges: e.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => setIsDeliveryModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button onClick={handleAddDelivery} className="btn btn-warning">
                  Add Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeliveryManagement;
