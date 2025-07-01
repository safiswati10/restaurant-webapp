import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

const RestaurantDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [profile, setProfile] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [deals, setDeals] = useState([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    image: null,
  });
  const [newDeal, setNewDeal] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    phone: "",
    address: "",
    owner_name: "",
    owner_phone: "",
    owner_email: "",
    type: ""
  });
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [editingDeal, setEditingDeal] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const primaryColor = "#FA8C16";

  // Helper function to safely extract values
  const getSafeValue = (value) => {
    if (value && typeof value === 'object' && 'text' in value) {
      return value.text;
    }
    return value || '';
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const res = await fetch(
          "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/restaurants/restaurant-list"
        );
        const result = await res.json();
        if (result.status === 1) {
          const currentRestaurant = result.data.find(
            (restaurant) => restaurant._id === userId
          );
          if (currentRestaurant) {
            const normalizedProfile = {
              ...currentRestaurant,
              name: getSafeValue(currentRestaurant.name),
              address: getSafeValue(currentRestaurant.address),
              phone: getSafeValue(currentRestaurant.phone),
              owner_name: getSafeValue(currentRestaurant.owner_name),
              owner_phone: getSafeValue(currentRestaurant.owner_phone),
              owner_email: getSafeValue(currentRestaurant.owner_email),
              type: getSafeValue(currentRestaurant.type),
              ratings: getSafeValue(currentRestaurant.ratings),
              orders: getSafeValue(currentRestaurant.orders),
              image: getSafeValue(currentRestaurant.image)
            };
            setProfile(normalizedProfile);
            setUpdatedProfile({
              name: normalizedProfile.name,
              phone: normalizedProfile.phone,
              address: normalizedProfile.address,
              owner_name: normalizedProfile.owner_name,
              owner_phone: normalizedProfile.owner_phone,
              owner_email: normalizedProfile.owner_email,
              type: normalizedProfile.type
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchMenuData = async () => {
      const restaurantId = localStorage.getItem("userId");
      try {
        const response = await fetch(
          "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/menus/menu-list"
        );
        const data = await response.json();

        if (data.status === 1) {
          const filteredMenus = data.data.filter(
            (menu) => menu.restaurantId === restaurantId
          );
          const normalizedMenus = filteredMenus.map(menu => ({
            ...menu,
            name: getSafeValue(menu.name),
            category: getSafeValue(menu.category),
            description: getSafeValue(menu.description),
            price: getSafeValue(menu.price)
          }));
          setMenuItems(normalizedMenus);
        } else {
          console.error("Failed to fetch menu items.");
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuData();
  }, []);

  useEffect(() => {
    const fetchDealsData = async () => {
      setIsLoading(true);
      const restaurantId = localStorage.getItem("userId");
      try {
        const response = await fetch(
          "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/deals/deal-list"
        );
        const data = await response.json();
  
        if (data.status === 1) {
          const restaurantDeals = data.data.filter(
            (deal) => deal.restaurantId === restaurantId
          );
          
          const normalizedDeals = restaurantDeals.map(deal => ({
            ...deal,
            name: getSafeValue(deal.name),
            description: getSafeValue(deal.description),
            price: getSafeValue(deal.price)
          }));
          
          setDeals(normalizedDeals);
        } else {
          setError("Failed to fetch deals: " + (data.message || "Unknown error"));
        }
      } catch (error) {
        setError("Error fetching deals: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDealsData();
  }, []);

  const handleMenuInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewMenuItem({ ...newMenuItem, [name]: files[0] });
    } else {
      setNewMenuItem({ ...newMenuItem, [name]: value });
    }
  };

  const handleDealInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewDeal({ ...newDeal, [name]: files[0] });
    } else {
      setNewDeal({ ...newDeal, [name]: value });
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageChange = (e) => {
    setNewProfileImage(e.target.files[0]);
  };

  const handleUpdateProfileImage = async () => {
    if (!newProfileImage) {
      setError("Please select an image");
      return;
    }

    setIsUpdatingProfile(true);
    setError("");

    const formData = new FormData();
    formData.append("my_file", newProfileImage);
    const restaurantId = localStorage.getItem("userId");

    try {
      const response = await fetch(
        `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/restaurants/update-restaurant/${restaurantId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.status === 1) {
        setProfile(prev => ({
          ...prev,
          image: result.data.image
        }));
        setShowProfileImageModal(false);
        setNewProfileImage(null);
        setSuccessMessage("Profile image updated successfully!");
      } else {
        throw new Error(result.message || "Failed to update profile image");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!updatedProfile.name || !updatedProfile.phone || !updatedProfile.address) {
      setError("Name, phone and address are required");
      return;
    }

    setIsUpdatingProfile(true);
    setError("");

    const restaurantId = localStorage.getItem("userId");
    const updateData = {
      name: updatedProfile.name,
      phone: updatedProfile.phone,
      address: updatedProfile.address,
      owner_name: updatedProfile.owner_name,
      owner_phone: updatedProfile.owner_phone,
      owner_email: updatedProfile.owner_email,
      type: updatedProfile.type
    };

    try {
      const response = await fetch(
        `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/restaurants/update-restaurant/${restaurantId}`,
        {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (result.status === 1) {
        setProfile(prev => ({
          ...prev,
          ...updateData
        }));
        setShowProfileUpdateModal(false);
        setSuccessMessage("Profile updated successfully!");
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAddMenuItem = async () => {
    const formData = new FormData();
    const restaurantId = localStorage.getItem("userId");

    formData.append("name", newMenuItem.name);
    formData.append("category", newMenuItem.category);
    formData.append("description", newMenuItem.description);
    formData.append("price", newMenuItem.price);
    formData.append("my_file", newMenuItem.image);
    formData.append("restaurantId", restaurantId);

    try {
      const response = await fetch(
        "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/menus/insert-menu",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.status === 1) {
        const normalizedItem = {
          ...result.data,
          name: getSafeValue(result.data.name),
          category: getSafeValue(result.data.category),
          description: getSafeValue(result.data.description),
          price: getSafeValue(result.data.price)
        };
        setMenuItems((prevItems) => [...prevItems, normalizedItem]);
        setShowMenuModal(false);
        setNewMenuItem({
          name: "",
          category: "",
          description: "",
          price: "",
          image: null,
        });
        setSuccessMessage("Menu item added successfully!");
      } else {
        throw new Error(result.message || "Failed to add menu item");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddDeal = async () => {
    if (!newDeal.name || !newDeal.price) {
      setError("Name and price are required");
      return;
    }

    const formData = new FormData();
    const restaurantId = localStorage.getItem("userId");

    formData.append("name", newDeal.name);
    formData.append("description", newDeal.description || "");
    formData.append("price", newDeal.price);
    formData.append("restaurantId", restaurantId);
    
    if (newDeal.image) {
      formData.append("my_file", newDeal.image);
    } else if (!editingDeal) {
      setError("Image is required for new deals");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const endpoint = editingDeal
        ? `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/deals/update-deal/${editingDeal._id}`
        : "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/deals/insert-deal";

      const method = editingDeal ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        body: formData,
      });

      const result = await response.json();

      if (result.status === 1) {
        const normalizedDeal = {
          ...result.data,
          name: getSafeValue(result.data.name),
          description: getSafeValue(result.data.description),
          price: getSafeValue(result.data.price),
          image: newDeal.image ? result.data.image : editingDeal?.image
        };
        
        if (editingDeal) {
          setDeals(prev => 
            prev.map(deal => deal._id === editingDeal._id ? normalizedDeal : deal)
          );
        } else {
          setDeals(prev => [...prev, normalizedDeal]);
        }
        
        setShowDealModal(false);
        setNewDeal({
          name: "",
          description: "",
          price: "",
          image: null,
        });
        setEditingDeal(null);
        setSuccessMessage(editingDeal ? "Deal updated successfully!" : "Deal added successfully!");
      } else {
        throw new Error(result.message || "Deal not inserted");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setNewDeal({
      name: getSafeValue(deal.name),
      description: getSafeValue(deal.description),
      price: getSafeValue(deal.price),
      image: null,
    });
    setShowDealModal(true);
    setError("");
    setSuccessMessage("");
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    
    try {
      const response = await fetch(
        `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/menus/delete-menu/${id}`,
        { method: "DELETE" }
      );
      const result = await response.json();

      if (result.status === 1) {
        setMenuItems(prev => prev.filter(item => item._id !== id));
        setSuccessMessage("Menu item deleted successfully!");
      } else {
        throw new Error(result.message || "Failed to delete menu item");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteDeal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/deals/delete-deal/${id}`,
        { method: "DELETE" }
      );
      const result = await response.json();

      if (result.status === 1) {
        setDeals(prev => prev.filter(deal => deal._id !== id));
        setSuccessMessage("Deal deleted successfully!");
      } else {
        throw new Error(result.message || "Failed to delete deal");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <div
        className="sidebar bg-dark text-white p-4"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <h4 className="text-center mb-4">Restaurant Panel</h4>
        <ul className="list-unstyled">
          {["profile", "menu", "deals", "orders", "notifications"].map(
            (tab) => (
              <li key={tab} className="mb-2">
                <button
                  className={`btn w-100 text-start ${
                    selectedTab === tab ? "btn-warning" : "btn-secondary"
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            )
          )}
        </ul>
      </div>

      <div className="container mt-4">
        {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
        {successMessage && <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>{successMessage}</Alert>}

        {selectedTab === "profile" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 style={{ color: primaryColor }}>Profile</h3>
              <div>
                <Button 
                  variant="outline-warning" 
                  onClick={() => setShowProfileImageModal(true)}
                  className="me-2"
                >
                  <i className="bi bi-camera me-2"></i>Update Image
                </Button>
                <Button 
                  variant="warning" 
                  onClick={() => setShowProfileUpdateModal(true)}
                >
                  <i className="bi bi-pencil me-2"></i>Edit Profile
                </Button>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="position-relative">
                  <img
                    src={profile.image ? `https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/uploads/${profile.image}` : "/placeholder-restaurant.jpg"}
                    alt="Restaurant"
                    className="img-fluid rounded"
                    style={{ maxHeight: "300px", width: "100%", objectFit: "cover", cursor: "pointer" }}
                    onClick={() => setShowProfileImageModal(true)}
                  />
                  <div className="position-absolute bottom-0 end-0 p-2">
                    <Button 
                      variant="warning" 
                      size="sm" 
                      onClick={() => setShowProfileImageModal(true)}
                      title="Change image"
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Phone:</strong> {profile.phone}</p>
                    <p><strong>Address:</strong> {profile.address}</p>
                    <p><strong>Owner Name:</strong> {profile.owner_name}</p>
                    <p><strong>Owner Phone:</strong> {profile.owner_phone}</p>
                    <p><strong>Owner Email:</strong> {profile.owner_email}</p>
                    <p><strong>Type:</strong> {profile.type}</p>
                    <p><strong>Ratings:</strong> {profile.ratings}</p>
                    <p><strong>Total Orders:</strong> {profile.orders}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "menu" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ color: primaryColor }}>Menu</h3>
              <button
                className="btn btn-warning"
                onClick={() => setShowMenuModal(true)}
                disabled={isLoading}
              >
                Add Menu Item
              </button>
            </div>

            {isLoading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : menuItems.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <img
                            src={`https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/uploads/${item.image}`}
                            alt={item.name}
                            width="60"
                            height="60"
                            style={{ objectFit: "cover" }}
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.description}</td>
                        <td>{item.price}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteMenuItem(item._id)}
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No menu items added.</p>
            )}
          </div>
        )}

        {selectedTab === "deals" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ color: primaryColor }}>Deals</h3>
              <button
                className="btn btn-warning"
                onClick={() => {
                  setEditingDeal(null);
                  setShowDealModal(true);
                }}
                disabled={isLoading}
              >
                Add Deal
              </button>
            </div>

            {isLoading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : deals.length > 0 ? (
              <div className="row">
                {deals.map((deal) => (
                  <div key={deal._id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      <img
                        src={`https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/uploads/${deal.image}`}
                        className="card-img-top"
                        alt={deal.name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{deal.name}</h5>
                        <p className="card-text">{deal.description}</p>
                        <p className="card-text">
                          <strong>Price: {deal.price}</strong>
                        </p>
                        <div className="mt-auto d-flex justify-content-between">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEditDeal(deal)}
                            disabled={isLoading}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteDeal(deal._id)}
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No deals added.</p>
            )}
          </div>
        )}
      </div>

      {/* Menu Item Modal */}
      <Modal show={showMenuModal} onHide={() => setShowMenuModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Menu Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Food Name*</Form.Label>
              <Form.Control
                name="name"
                value={newMenuItem.name}
                onChange={handleMenuInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category*</Form.Label>
              <Form.Control
                name="category"
                value={newMenuItem.category}
                onChange={handleMenuInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newMenuItem.description}
                onChange={handleMenuInputChange}
                rows={3}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price*</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={newMenuItem.price}
                onChange={handleMenuInputChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image*</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleMenuInputChange}
                accept="image/*"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMenuModal(false)}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            onClick={handleAddMenuItem}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Deal Modal */}
      <Modal
        show={showDealModal}
        onHide={() => {
          setShowDealModal(false);
          setEditingDeal(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingDeal ? "Edit Deal" : "Add Deal"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Deal Name*</Form.Label>
              <Form.Control
                name="name"
                value={newDeal.name}
                onChange={handleDealInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newDeal.description}
                onChange={handleDealInputChange}
                rows={3}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price*</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={newDeal.price}
                onChange={handleDealInputChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{editingDeal ? "Change Image" : "Image*"}</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleDealInputChange}
                accept="image/*"
                required={!editingDeal}
              />
              {editingDeal && editingDeal.image && !newDeal.image && (
                <div className="mt-2">
                  <small>Current Image:</small>
                  <img
                    src={`https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/uploads/${editingDeal.image}`}
                    alt="Current deal"
                    width="60"
                    className="d-block mt-1"
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDealModal(false);
              setEditingDeal(null);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            onClick={handleAddDeal}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                {editingDeal ? "Updating..." : "Adding..."}
              </>
            ) : editingDeal ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Profile Image Update Modal */}
      <Modal show={showProfileImageModal} onHide={() => setShowProfileImageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>New Restaurant Image*</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileImageModal(false)}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            onClick={handleUpdateProfileImage}
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Updating...
              </>
            ) : "Update Image"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Profile Update Modal */}
      <Modal show={showProfileUpdateModal} onHide={() => setShowProfileUpdateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Restaurant Name*</Form.Label>
              <Form.Control
                name="name"
                value={updatedProfile.name}
                onChange={handleProfileInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone*</Form.Label>
              <Form.Control
                name="phone"
                value={updatedProfile.phone}
                onChange={handleProfileInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address*</Form.Label>
              <Form.Control
                name="address"
                value={updatedProfile.address}
                onChange={handleProfileInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Owner Name</Form.Label>
              <Form.Control
                name="owner_name"
                value={updatedProfile.owner_name}
                onChange={handleProfileInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Owner Phone</Form.Label>
              <Form.Control
                name="owner_phone"
                value={updatedProfile.owner_phone}
                onChange={handleProfileInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Owner Email</Form.Label>
              <Form.Control
                name="owner_email"
                type="email"
                value={updatedProfile.owner_email}
                onChange={handleProfileInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Restaurant Type</Form.Label>
              <Form.Control
                name="type"
                value={updatedProfile.type}
                onChange={handleProfileInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileUpdateModal(false)}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            onClick={handleUpdateProfile}
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Updating...
              </>
            ) : "Update Profile"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RestaurantDashboard;