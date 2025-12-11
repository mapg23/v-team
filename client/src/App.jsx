import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import LoginView from "./views/LoginView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginView />} />
      </Routes>
    </Router>
  );
}

export default App;
