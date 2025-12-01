import './App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginView from "./views/auth/LoginView";
import HomeView from "./views/home/HomeView"

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginView />} />
          <Route path="/home" element={<HomeView />} />
        </Routes>
      </Router>
    </>
  );
}

export default App

