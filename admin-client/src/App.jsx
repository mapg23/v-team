import './App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/forms/Loginform"
import HomeView from "./views/home/HomeView"

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomeView />} />
        </Routes>
      </Router>
    </>
  );
}

export default App

