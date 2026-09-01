import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      console.log(response.data);

      const user = response.data.data;

      // Save JWT token
      localStorage.setItem("token", user.token);

      // Save user information
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect according to role
      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "mentor") {
        navigate("/mentor-dashboard");
      }

    } catch (error) {
      console.log(error.response?.data);
      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;