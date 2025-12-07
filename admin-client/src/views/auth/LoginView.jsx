import { useNavigate } from "react-router-dom";
import LoginForm from "components/forms/LoginForm"
import authService from "services/auth"

export default function LoginView() {
  const navigate = useNavigate(); // redirect på React vis

  async function handleLogin({email, password}) {
    console.log("haneLogin in loginView")
    const success = await authService.login({email, password});

    if (success) {
      navigate("/home"); // Redirect!
    }
  }

  return <LoginForm onFormSubmit={handleLogin} />;
}
