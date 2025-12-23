import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider, MiddleWare, useAuth } from "./components/AuthProvider";

import { BrowserView, MobileView } from "react-device-detect";

// Phone views
import LoginView from "./views/LoginView";
import HomeView from "./views/HomeView";
import AccountView from "./views/AccountView";
import TransactionsView from "./views/TransactionsView";

// Web views
import WebAccountView from "./views/WebAccountview";


// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/all.css";

function App() {
  return (
    <Router>
      <AuthProvider>
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

          <Route path="/transactions" element={
            <MiddleWare>
              <MobileView>
                <TransactionsView />
              </MobileView>
            </MiddleWare>
          } />

          <Route path="/login" element={<LoginView />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
