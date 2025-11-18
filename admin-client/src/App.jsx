import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/Login"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/user" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App

