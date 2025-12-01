import './App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginView from "./views/auth/LoginView";
import HomeView from "./views/home/HomeView"
import Navbar from "./components/nav/Nav";

function App() {

  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <div className="app-content">
          <div className="userContainer">
            <div className="user">
              {/* usercomponent */}
            </div>
          </div>

          <Routes>
            {/* Only view content changes on routes, nav and user is
            always present */}
            <Route path="/" element={<LoginView />} />
            {/* <Route path="/home" element={<HomeView />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App

