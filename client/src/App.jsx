import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import {Navigate } from "react-router-dom";

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
import PaymentSuccessView from "./views/payments/PaymentSuccessView";

// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/all.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(sessionStorage.getItem("jwt"))
  );

  function login() {
    setIsLoggedIn(true);
  }

  function logout() {
    sessionStorage.clear();
    setIsLoggedIn(false);
  }

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          isLoggedIn
            ? <Navigate to="/" replace />
            : <LoginView loginCallback={login} />
        }
      />

      <Route
        path="/login/github/callback"
        element={<GithubCallback onLogin={login} />}
      />

      {/* APP */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <>
              <MobileView>
                <HomeView />
              </MobileView>

              <BrowserView>
                <WebAccountView logoutcallback={logout}/>
              </BrowserView>
            </>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/account"
        element={
          isLoggedIn
            ? <MobileView><AccountView /> </MobileView>
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/history"
        element={
          isLoggedIn
            ? <MobileView> <HistoryView /> </MobileView>
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/transactions"
        element={
          isLoggedIn
            ? <MobileView><TransactionsView /></MobileView>
            : <Navigate to="/login" replace />
        }
      />

      <Route path="/bike/:id" element={
        isLoggedIn
          ? <MobileView> <BikeView/> </MobileView>
          : <Navigate to="/login" replace />
      } />

      <Route path="/pay" element={
        isLoggedIn
        ? <PaymentView />
        : <Navigate to="/login" replace />
      } />

      <Route path="/payment/complete" element={
        isLoggedIn 
        ? <PaymentSuccessView />
        : <Navigate to="/login" replace />
      } />

      {/* FALLBACK */}
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
      />

    </Routes>
  );
}

export default App;
