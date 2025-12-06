import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginView from "./views/auth/LoginView";
import HomeView from "./views/home/HomeView";
import Navbar from "./components/nav/Nav";
import { useState } from "react";
import GithubCallback from "./components/auth/GithubCallback";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-content">
        <Router>
          <Routes>
            <Route path="/" element={<LoginView />}></Route>
            <Route path="/login/github/callback" element={<GithubCallback />} />
            <Route path="/welcome" element={<HomeView />}></Route>
          </Routes>
        </Router>
      </div>
    </div>
  );

  if (!loggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginView />}></Route>
          <Route path="/login/github/callback" element={<GithubCallback />} />
          <Route path="/welcome" element={<HomeView />}></Route>
        </Routes>
      </Router>
    );
  }
  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-content">
        <Router>
          <Routes>
            <Route path="/welcome" element={<HomeView />}></Route>
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
