import React, { useState, useEffect } from "react";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";

const RiderManagement = () => {
  const [riders, setRiders] = useState({ active: [], pending: [] });
  const [filter, setFilter] = useState("active");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [riderToDelete, setRiderToDelete] = useState(null);
  const [loading, setLoading] = useState({
    fetch: true,
    delete: false,
    approve: false
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchWithErrorHandling = async (url, options = {}) => {
    const response = await fetch(url, options);
    const text = await response.text();
    
    // Check if response is HTML error page
    if (text.startsWith("<!DOCTYPE")) {
      throw new Error("Server returned an error page. Please check the API endpoint.");
    }
    
    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (e) {
      throw new Error("Invalid JSON response from server");
    }
  };

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        setLoading(prev => ({ ...prev, fetch: true }));
        setError(null);
        
        const [activeData, pendingData] = await Promise.all([
          fetchWithErrorHandling("https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/riders/rider-list"),
          fetchWithErrorHandling("https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/pendingRiders/pendingRider-list")
        ]);

        setRiders({
          active: activeData.data || [],
          pending: pendingData.data || []
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
      }
    };

    fetchRiders();
  }, []);

  const handleDeleteRider = async () => {
    if (!riderToDelete) return;
    
    try {
      setLoading(prev => ({ ...prev, delete: true }));
      setError(null);
      
      const isPending = riders.pending.some(r => r._id === riderToDelete);
      
      // Try both possible endpoints for pending riders
      let endpoint;
      let data;
      
      if (isPending) {
        // First try the pendingRiders endpoint
        endpoint = `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/pendingRiders/delete-pendingRider/${riderToDelete}`;
        try {
          data = await fetchWithErrorHandling(endpoint, { method: "DELETE" });
        } catch (firstError) {
          console.log("First delete attempt failed, trying alternative endpoint");
          // If that fails, try the riders endpoint
          endpoint = `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/pendingRiders/deletePending-rider/${riderToDelete}`;
          data = await fetchWithErrorHandling(endpoint, { method: "DELETE" });
        }
      } else {
        endpoint = `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/riders/delete-rider/${riderToDelete}`;
        data = await fetchWithErrorHandling(endpoint, { method: "DELETE" });
      }

      if (data.status === 1) {
        setRiders(prev => ({
          active: prev.active.filter(r => r._id !== riderToDelete),
          pending: prev.pending.filter(r => r._id !== riderToDelete)
        }));
        setSuccessMessage(`Rider ${isPending ? 'pending approval' : ''} deleted successfully`);
      } else {
        throw new Error(data.message || "Failed to delete rider");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(`Failed to delete rider: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
      setShowDeleteModal(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleApproveRider = async (riderId) => {
    try {
      setLoading(prev => ({ ...prev, approve: true }));
      setError(null);
      
      const data = await fetchWithErrorHandling(
        `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/pendingRiders/approvePending-rider/${riderId}`,
        { method: "POST" }
      );

      if (data.status === 1) {
        const approvedRider = riders.pending.find(r => r._id === riderId);
        setRiders(prev => ({
          active: [...prev.active, approvedRider],
          pending: prev.pending.filter(r => r._id !== riderId)
        }));
        setSuccessMessage("Rider approved successfully");
      } else {
        throw new Error(data.message || "Failed to approve rider");
      }
    } catch (err) {
      console.error("Approval error:", err);
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, approve: false }));
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading.fetch) return (
    <div className="text-center py-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading riders...</span>
      </Spinner>
      <p>Loading riders...</p>
    </div>
  );

  if (error) return (
    <div className="container py-4">
      <Alert variant="danger">
        Error: {error}
        <div className="mt-2">
          <Button variant="warning" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </Alert>
    </div>
  );

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Rider Management</h2>
      
      <div className="d-flex gap-2 mb-4">
        <Button 
          variant={filter === "active" ? "warning" : "secondary"}
          onClick={() => setFilter("active")}
          disabled={loading.fetch}
        >
          Active Riders ({riders.active.length})
        </Button>
        <Button 
          variant={filter === "pending" ? "warning" : "secondary"}
          onClick={() => setFilter("pending")}
          disabled={loading.fetch}
        >
          Pending Approval ({riders.pending.length})
        </Button>
      </div>

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
          {successMessage}
        </Alert>
      )}

      {riders[filter].length === 0 ? (
        <Alert variant="info">No {filter} riders found</Alert>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Bank Details</th>
                <th>Joined On</th>
                <th>Orders</th>
                {filter === "pending" && <th>Approve</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders[filter].map(rider => (
                <tr key={rider._id}>
                  <td>{rider.name || "N/A"}</td>
                  <td>{rider.phone || "N/A"}</td>
                  <td>
                    {rider.vehicle_type || "N/A"} ({rider.vehicle_number || "N/A"})
                  </td>
                  <td>
                    {rider.bank_name || "N/A"} - {rider.account_number || "N/A"}
                  </td>
                  <td>{formatDate(rider.joining_date)}</td>
                  <td>{rider.completed_orders || 0}</td>
                  {filter === "pending" && (
                    <td>
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleApproveRider(rider._id)}
                        disabled={loading.approve}
                      >
                        {loading.approve ? (
                          <Spinner size="sm" animation="border" />
                        ) : (
                          "Approve"
                        )}
                      </Button>
                    </td>
                  )}
                  <td>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => {
                        setRiderToDelete(rider._id);
                        setShowDeleteModal(true);
                      }}
                      disabled={loading.delete}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this rider? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={loading.delete}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteRider}
            disabled={loading.delete}
          >
            {loading.delete ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Delete Rider"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RiderManagement;