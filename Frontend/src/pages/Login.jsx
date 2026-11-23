import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

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
      localStorage.setItem("role", user.role); // Save user role

      // Save user information
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect according to role
      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "alumni") {
        navigate("/mentor-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      }

    } catch (error) {
      console.log(error.response?.data);
      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="login-page">

    <div className="login-left">
      <h1>SeniorConnect AI</h1>

      <div className="login-intro">
        <h2>Connect. Learn. Grow.</h2>

        <p>
          Connect with your college alumni,
          get career guidance, and prepare
          confidently for your dream job.
        </p>
      </div>
    </div>

     <div className="login-right">
       <div className="login-card">

        <h2>Welcome Back!</h2>

        <p className="login-subtitle">
          Sign in to continue your journey.
        </p>
    

      <form onSubmit={handleLogin}>
            
          <label htmlFor="email">Email Address</label>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

          <label htmlFor="password">Password</label>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="login-button" type="submit">
          Login
        </button>
        <p className="register-txt">
          Don't have an account?{" "}

          <button className="register-button" type="button" onClick={() => navigate("/register")}>
            Register
          </button>
        </p>

      </form>
    </div>
   </div>
  </div>
  );
}

export default Login;