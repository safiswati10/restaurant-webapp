import React, { useState, useEffect } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const renderAddress = (address) => {
    if (!address) return "No address";
    if (typeof address === "string") return address;
    return address.text || JSON.stringify(address);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(
            "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/users/user-list"
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        const apiResponse = JSON.parse(data.contents);
        if (apiResponse.status === 1 && apiResponse.data) {
          setUsers(apiResponse.data);
        } else {
          console.error("No users found in the API response");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `http://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/users/delete-user/${userId}`
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      handleDeleteUser(itemToDelete);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <h2 className="text-center mb-4">Manage Users</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name || "N/A"}</td>
              <td>{user.phone || "N/A"}</td>
              <td>{user.email || "N/A"}</td>
              <td>{renderAddress(user.address)}</td>
              <td>{user.order || "N/A"}</td>
              <td>
                <button
                  onClick={() => handleDelete(user._id)}
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
                <p>Are you sure you want to delete this user?</p>
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
          User deleted successfully!
        </div>
      )}
    </>
  );
};

export default UserManagement;
