import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");

  const navigate = useNavigate();
  
  const handleRegister = async(e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", { name, email, password, role, 
        college, branch, currentYear, graduationYear });
      console.log("Registration successful:", response.data);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.log("Register error:", error.response?.data);
      alert("Registration failed. Please try again.");
    }
  };

  return (

  <div className="register-page">
    <section className="register-left">
      <div className="register-brand">
        <div className="register-logo">S</div>
        <h1>SeniorConnect <span>AI</span></h1>
      </div>


  <div className="register-intro">
    <span className="register-badge">YOUR CAREER JOURNEY STARTS HERE</span>
    <h2>Connect. Learn. Grow.</h2>
    <p>
      Join your college community, connect with alumni,
      discover career opportunities, and prepare for
      your dream job with AI.
    </p>

    <div className="register-benefits">
      <div className="register-benefit">
        <span>01</span>
        <div>
          <h3>Connect with Alumni</h3>
          <p>Learn from seniors who have been there.</p>
        </div>
      </div>

      <div className="register-benefit">
        <span>02</span>
        <div>
          <h3>Prepare with Confidence</h3>
          <p>Practice interviews and improve your skills.</p>
        </div>
      </div>
    </div>
  </div>

  <p className="register-footer">
    Empowering students, one connection at a time.
  </p>
</section>

<section className="register-right">
  <div className="register-card">
    <div className="register-heading">
      <p className="register-eyebrow">GET STARTED FOR FREE</p>
      <h2>Create your account</h2>
      <p>Join SeniorConnect AI and take the next step in your career.</p>
    </div>

    <form className="register-form" onSubmit={handleRegister}>
      <div className="register-field">
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="register-field">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="register-field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <div className="register-field">
        <label htmlFor="college">College</label>
        <input
          id="college"
          type="text"
          placeholder="Enter your college name"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          required
        />
      </div>

      <div className="register-field">
        <label htmlFor="role">I want to join as</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="alumni">Alumni / Mentor</option>
        </select>
      </div>

      {role === "student" && (
        <div className="register-role-fields">
          <div className="register-field">
            <label htmlFor="branch">Branch / Department</label>
            <input
              id="branch"
              type="text"
              placeholder="e.g. CSE"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="currentYear">Current year</label>
            <select
              id="currentYear"
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
              required
            >
              <option value="">Select current year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div className="register-field">
            <label htmlFor="graduationYear">Graduation year</label>
            <input
              id="graduationYear"
              type="number"
              placeholder="e.g. 2027"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      {role === "alumni" && (
        <div className="register-role-fields">
          <div className="register-field">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              placeholder="Where do you work?"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="designation">Designation</label>
            <input
              id="designation"
              type="text"
              placeholder="e.g. Software Engineer"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      <button className="register-submit" type="submit">
        Create Account <span>→</span>
      </button>

      <p className="register-login-text">
        Already have an account?{" "}
        <button
          className="register-login-link"
          type="button"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </p>
    </form>
  </div>
</section>


  </div>
);
}
export default Register;