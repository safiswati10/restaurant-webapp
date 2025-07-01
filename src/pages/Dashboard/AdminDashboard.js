import React, { useState } from "react";
import UserManagement from ".//AdminDashboard/UserManagement";
import RestaurantManagement from ".//AdminDashboard/RestaurantManagement";
import RiderManagement from ".//AdminDashboard/RiderManagement";
import DeliveryManagement from ".//AdminDashboard/DeliveryManagement";
import OrderManagement from ".//AdminDashboard/OrderManagement";
import RevenueManagement from ".//AdminDashboard/RevenueManagement";
import SalaryManagement from ".//AdminDashboard/SalaryManagement";
import FeaturedRestaurantManagement from ".//AdminDashboard/FeaturedRestaurantManagement";
import AdminProfile from ".//AdminDashboard/AdminProfile";
const AdminDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("users");

  return (
    <div className="d-flex">
      <div
        className="sidebar bg-dark text-white p-4"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <h4 className="text-center mb-4">Admin Dashboard</h4>
        <ul className="list-unstyled">
          {[
            
            "users",
            "restaurants",
            "FeaturedRes",
            "riders",
            "delivery",
            "orders",
            "revenue",
            "salary",
            "Reset email/pass",
          ].map((category) => (
            <li className="mb-2" key={category}>
              <button
                className={`btn w-100 text-start ${
                  selectedCategory === category
                    ? "btn-warning"
                    : "btn-secondary"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="container mt-4 w-100">
      {selectedCategory === "users" && <UserManagement />}
        {selectedCategory === "restaurants" && <RestaurantManagement />}
        {selectedCategory === "FeaturedRes" && <FeaturedRestaurantManagement />}
        {selectedCategory === "riders" && <RiderManagement />}
        {selectedCategory === "delivery" && <DeliveryManagement />}
        {selectedCategory === "orders" && <OrderManagement />}
        {selectedCategory === "revenue" && <RevenueManagement />}
        {selectedCategory === "salary" && <SalaryManagement />}
        {selectedCategory === "Reset email/pass" && <AdminProfile />}
      </div>
    </div>
  );
};

export default AdminDashboard;
