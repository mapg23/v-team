import { useNavigate } from "react-router-dom";

import './LoginView.css'
import AuthForm from '../components/AuthForm';


export default function LoginView() {
  const navigate = useNavigate(); // redirect på React vis

  function handleLogin(data) {
    console.log(data);
  }

  return (
    <div className="container">

      <div className="container-header">
      </div>

      <div className="container-body">
        <AuthForm callback={handleLogin}></AuthForm>
      </div>

      <div className="container-footer"></div>
    </div>
  );
}
