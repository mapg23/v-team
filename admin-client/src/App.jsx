import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginView from "./views/auth/LoginView";
import HomeView from "./views/home/HomeView";
import UserView from "./views/user/UserView";
import Navbar from "./components/nav/Nav";
import { useState } from "react";
import GithubCallback from "./components/auth/GithubCallback";
// import SocketTest from "./components/socket/SocketTest.jsx"

function App() {
  // const isLoggedin = sessionStorage.getItem("jwt") ? true : false;
  const isLoggedin = true;
  if (!isLoggedin) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginView />}></Route>
          <Route path="/login/github/callback" element={<GithubCallback />} />
        </Routes>
      </Router>
    );
  }

  /**
   * User is logged in
   */
  return (
    <div className="app-layout">
      {/* <SocketTest /> */}
      <Navbar />
      <div className="app-content">
        <Router>
          <Routes>
            <Route path="/welcome" element={<HomeView />}></Route>
            <Route path="/user/:id" element={<UserView />}></Route>
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
