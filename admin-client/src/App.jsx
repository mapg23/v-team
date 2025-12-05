import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginView from "./views/auth/LoginView";
import HomeView from "./views/home/HomeView";
import Navbar from "./components/nav/Nav";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  if (!loggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginView />}></Route>
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
            <Route path="/" element={<HomeView />}></Route>
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
