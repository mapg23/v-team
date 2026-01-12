import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginView from "./views/auth/LoginView";
import HomeView from "./views/home/HomeView";
import CityView from "./views/city/CityView";
import BikeView from "./views/bike/BikeView";
import InspectCityView from "./views/city/InspectCityView";
import InspectBikeView from "./views/bike/InspectBikeView";
import ProfileView from "./views/user/ProfileView";
import UsersView from "./views/user/UsersView";
import CostView from "./views/cost/CostView";
import Navbar from "./components/nav/Nav";
import { useState } from "react";
import GithubCallback from "./components/auth/GithubCallback";
import ParkingView from "./views/parking/ParkingView";
import ChargingView from "./views/charging/ChargingView";

function App() {
  const jwt = sessionStorage.getItem("jwt") ? true : false;

  const [isLoggedin, setIsLoggedIn] = useState(jwt);

  async function login() {
    const jwt = sessionStorage.getItem("jwt") ? true : false;
    setIsLoggedIn(jwt);
  }

  async function logout() {
    sessionStorage.removeItem("jwt");
    setIsLoggedIn(false);
  }

  // --------------------------------------------
  // NOT LOGGED IN
  // --------------------------------------------
  if (!isLoggedin) {
    return (
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route
          path="/login/github/callback"
          element={<GithubCallback onLogin={login} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // --------------------------------------------
  // LOGGED IN
  // --------------------------------------------
  return (
    <div className="app-layout">
      <div className="navContainer">
        <Navbar logout={logout} />
      </div>
      <div className="app-content">
        <Routes>
          <Route path="/home" element={<HomeView />} />
          <Route path="/user/:id" element={<ProfileView />} />
          <Route path="/users" element={<UsersView />} />
          <Route path="/city/:id" element={<InspectCityView />} />
          <Route path="/cities" element={<CityView />} />
          <Route path="/bikes/:id" element={<InspectBikeView />} />
          <Route path="/bikes" element={<BikeView />} />
          <Route path="/parkings" element={<ParkingView />} />
          <Route path="/stations" element={<ChargingView />} />
          <Route path="/cost" element={<CostView />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
