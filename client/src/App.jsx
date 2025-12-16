import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import "bootstrap/dist/css/bootstrap.min.css";

import { AuthProvider, MiddleWare, useAuth } from "./components/AuthProvider";
import AnimatedPage from "./components/AnimatedPage";

import LoginView from "./views/LoginView";
import HomeView from "./views/HomeView";
import AccountView from "./views/AccountView";

function App() {
  return (
    <AnimatePresence mode="wait">

      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={
              <AnimatedPage>
                <LoginView />
              </AnimatedPage>

            } />
            <Route path="/" element={
              <MiddleWare>
                <AnimatedPage>
                  <HomeView />
                </AnimatedPage>
              </MiddleWare>
            } />

            <Route path="/account" element={
              <MiddleWare>
                <AnimatedPage>
                  <AccountView />
                </AnimatedPage>
              </MiddleWare>
            } />
          </Routes>
        </AuthProvider>
      </Router>

    </AnimatePresence>
  );
}

export default App;
