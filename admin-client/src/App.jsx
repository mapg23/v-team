import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginView from "./views/auth/LoginView";
import HomeView from "./views/home/HomeView";
import CityView from "./views/city/CityView";
import InspectCityView from "./views/city/InspectCityView";
import ProfileView from "./views/user/ProfileView";
import Navbar from "./components/nav/Nav";
import { useEffect, useState } from "react";
import GithubCallback from "./components/auth/GithubCallback";

function App() {
  const jwt = sessionStorage.getItem("jwt") ? true : false;

  const [isLoggedin, setIsLoggedIn] = useState(jwt);

  useEffect(() => {
    const state = sessionStorage.getItem("jwt") ? true : false;
    setIsLoggedIn(Boolean(state));
  }, []);

  async function login() {
    const jwt = sessionStorage.getItem("jwt") ? true : false;
    console.log(jwt);
    setIsLoggedIn(true);
  }

  async function logout() {
    sessionStorage.removeItem("jwt");
    setIsLoggedIn(false);
  }

  return (
    <Router>
      {!isLoggedin ? (
        // --------------------------------------------
        // NOT LOGGED IN
        // --------------------------------------------
        <Routes>
          <Route path="/" element={<LoginView />} />
          <Route
            path="/login/github/callback"
            element={<GithubCallback onLogin={login} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        // --------------------------------------------
        // LOGGED IN
        // --------------------------------------------
        <div className="app-layout">
          <Navbar logout={logout} />
          <div className="app-content">
            <Routes>
              <Route path="/welcome" element={<HomeView />} />
              <Route path="/user/:id" element={<ProfileView />} />
              <Route path="/city/:id" element={<InspectCityView />} />
              <Route path="/cities" element={<CityView />} />
              <Route path="*" element={<Navigate to="/welcome" />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
