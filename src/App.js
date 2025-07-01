import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import HomePage from "./pages/HomePage";
import RestaurantsPage from "./pages/RestaurantsPage";
import DealsPage from "./pages/DealsPage";
import CategoriesPage from "./pages/CategoriesPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import ListYourResturant from "./pages/ListYourResturant";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import RestaurantDashboard from "./pages/Dashboard/ResturantDashboard";
import RestaurantSignup from "./pages/SignUp/RestaurantSignup";
import RiderSignup from "./pages/SignUp/RiderSignup";
import UserSignup from "./pages/SignUp/UserSignup";
import RiderDashboard from "./pages/Dashboard/RiderDashboard";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import ContactUs from "./pages/Contactus"
import AboutUs from "./pages/Aboutus"
import CheckoutPage from "./pages/CheckoutPage";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CategoryItemsPage from "./Components/CategoryItemsPage";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/ListYourResturant" element={<ListYourResturant />} />
          <Route path="/restaurant-signup" element={<RestaurantSignup />} />
          <Route path="/rider-signup" element={<RiderSignup />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/category/:categoryName" element={<CategoryItemsPage />} />
          <Route path="/restaurant/:id/:name" element={<RestaurantMenuPage />} />
          {/* Protected Routes */}
          // Change the profile route to this:
             <Route path="/profile" element={<ProfilePage />} />
             <Route
  path="/UserDashboard"
  element={
    <ProtectedRoute allowedRoles={['user']}>
      <UserDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/RiderDashboard"
  element={
    <ProtectedRoute allowedRoles={['rider']}>
      <RiderDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/RestaurantDashboard"
  element={
    <ProtectedRoute allowedRoles={['restaurant']}>
      <RestaurantDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/AdminDashboard"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
