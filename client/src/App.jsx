import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState } from "react";

import LoginView from "./views/LoginView";
import PaymentView from "./views/PaymentView";
import PaymentSuccessView from "./views/PaymentSuccessView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/payment" element={<PaymentView />} />
        <Route path="/payment/complete" element={<PaymentSuccessView />} />
      </Routes>
    </Router>
  );
}

export default App;
