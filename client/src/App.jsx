import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider, MiddleWare, useAuth } from "./components/AuthProvider";

import { BrowserView, MobileView } from "react-device-detect";

// Phone views
import LoginView from "./views/LoginView";
import HomeView from "./views/HomeView";
import AccountView from "./views/AccountView";
import TransactionsView from "./views/TransactionsView";
import HistoryView from "./views/HistoryView";
import BikeView from "./views/BikeView";

import GithubCallback from "./components/GithubCallback"

// Web views
import WebAccountView from "./views/WebAccountview";

import PaymentView from "./views/payments/PaymentView";


// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/all.css";

import { jwtDecode } from "jwt-decode";

function App() {
  const { login, logout } = useAuth();

  const jwt = sessionStorage.getItem("jwt") ? true : false;

  const [isLoggedin, setIsLoggedIn] = useState(jwt);

  const handleLogin = () => {
    const jwt = sessionStorage.getItem("jwt") ? true : false;

    const token = sessionStorage.getItem("jwt");
    const payload = jwtDecode(token);
    console.log(payload)
  }


  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <MiddleWare>

            <MobileView>
              <HomeView />
            </MobileView>

            <BrowserView>
              <WebAccountView />
            </BrowserView>

          </MiddleWare>
        } />

        <Route path="/account" element={
          <MiddleWare>
            <MobileView>
              <AccountView />
            </MobileView>
          </MiddleWare>
        } />

        <Route path="/history" element={
          <MiddleWare>
            <MobileView>
              <HistoryView />
            </MobileView>

            <BrowserView>
              <HistoryView />
            </BrowserView>
          </MiddleWare>
        } />

        <Route path="/transactions" element={
          <MiddleWare>
            <MobileView>
              <TransactionsView />
            </MobileView>
          </MiddleWare>
        } />

        <Route path="/pay" element={
          <MiddleWare>
            <PaymentView />
          </MiddleWare>
        } />

        <Route path="/bike/:id" element={
          <MiddleWare>
            <BikeView />
          </MiddleWare>
        } />

        <Route path="/login" element={<LoginView />} />

        <Route
          path="/login/github/callback"
          element={<GithubCallback onLogin={handleLogin} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
