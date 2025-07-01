import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const ProfilePage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Moved this up before first useEffect
  const { isAuthenticated, login, logout, role, userId } = useContext(AuthContext);

  const API_BASE_URL = "https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api";

  useEffect(() => {
    if (isAuthenticated) {
      if (location.state?.fromCheckout) {
        navigate("/checkout");
      } else {
        switch (role) {
          case "user": navigate("/UserDashboard"); break;
          case "rider": navigate("/RiderDashboard"); break;
          case "restaurant": navigate("/RestaurantDashboard"); break;
          case "admin": navigate("/AdminDashboard"); break;
          default: break;
        }
      }
    }
  }, [isAuthenticated, role, navigate, location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // First check if it's an admin login
      const adminResponse = await fetch(`${API_BASE_URL}/admin/admin-list`);
      const adminData = await adminResponse.json();
      
      if (adminData.status === 1 && Array.isArray(adminData.data)) {
        const admin = adminData.data.find(a => 
          a.email === credentials.username && 
          a.password === credentials.password
        );

        if (admin) {
          login(admin._id, "admin");
          return;
        }
      }

      // If not admin, proceed with normal role-based login
      if (!credentials.role) {
        throw new Error("Please select a role");
      }

      let endpoint = "";
      let passwordField = "password";
      let idField = "_id";
      
      switch (credentials.role) {
        case "user":
          endpoint = `${API_BASE_URL}/users/user-list`;
          break;
        case "rider":
          endpoint = `${API_BASE_URL}/riders/rider-list`;
          break;
        case "restaurant":
          endpoint = `${API_BASE_URL}/restaurants/restaurant-list`;
          break;
        default:
          throw new Error("Invalid role selected");
      }

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      let dataArray = [];

      if (Array.isArray(result)) dataArray = result;
      else if (result.data && Array.isArray(result.data)) dataArray = result.data;
      else if (result[`${credentials.role}s`]) dataArray = result[`${credentials.role}s`];
      else if (result.list) dataArray = result.list;

      if (!Array.isArray(dataArray)) {
        throw new Error(`Unexpected ${credentials.role} data format`);
      }

      const user = dataArray.find(u => 
        (u.email === credentials.username || 
         u.name === credentials.username || 
         u.username === credentials.username) && 
        u[passwordField] === credentials.password
      );

      if (!user) throw new Error(`Invalid credentials for ${credentials.role}`);

      login(user[idField] || user.id || user._id || user.userId, credentials.role);

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setCredentials({ ...credentials, role });
  };

  const handleSignup = () => {
    if (!credentials.role) {
      setError("Please select a role before signing up.");
      return;
    }
    navigate(`/${credentials.role}-signup`);
  };

  const handleLogout = () => {
    logout();
    navigate("/profile");
  };

  if (isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="card p-4 mx-auto" style={{ maxWidth: "600px" }}>
          <h2 className="text-center mb-4">Your Profile</h2>
          <div className="mb-3">
            <p><strong>User ID:</strong> {userId}</p>
            <p><strong>Role:</strong> {role}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="btn btn-danger"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Name/Email</label>
            <input
              type="text"
              className="form-control"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Select Role</label>
            <div className="d-flex justify-content-between">
              {["user", "rider", "restaurant"].map((role) => (
                <div key={role} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={role}
                    name="role"
                    value={role}
                    checked={credentials.role === role}
                    onChange={() => handleRoleChange(role)}
                  />
                  <label className="form-check-label" htmlFor={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "#fa8c16", color: "#fff" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <div className="mt-3 text-center">
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={handleSignup}
                className="btn btn-link p-0"
                style={{ color: "#fa8c16" }}
              >
                Sign Up
              </button>
            </p>
            <p>
              <a href="/forget-password" style={{ color: "#fa8c16" }}>
                Forgot Password?
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;