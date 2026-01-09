import { useNavigate } from "react-router-dom";
import LoginForm from "components/forms/LoginForm"
import authService from "services/auth"
import LoginWithGithub from "../../components/auth/LoginWithGithub";
import { useState } from "react";
import formstyle from "../../components/forms/Form.module.css"

export default function LoginView() {
  const navigate = useNavigate(); // redirect på React vis
  const [loginMessage, setLoginMessage] = useState("");

  async function handleLogin({email, password, username}) {
    const response = await authService.login({email, password, username});
    if (!response.error) {
      navigate("/home"); // Redirect!
    }
    setLoginMessage(response.error);
  }

  return (
    <>
      <h2>Logga in</h2>
      <div className={loginMessage ? formstyle.errorDiv : ""}>
        <span>{loginMessage}</span>
      </div>
      <LoginForm onFormSubmit={handleLogin}></LoginForm>
      {/* <br /> */}
      <LoginWithGithub></LoginWithGithub>
    </>
  );
}
