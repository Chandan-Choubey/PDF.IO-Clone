import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import "../Css/LoginSignupForm.css";

const LoginSignupForm = ({ closeForm }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setMessage("");
  };

  const showForgotPassword = () => {
    setIsForgotPassword(true);
    setMessage("");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let response;
      if (isForgotPassword) {
        response = await axios.post("/api/auth/reset-password", {
          email: formData.resetEmail,
        });
      } else if (isLogin) {
        response = await axios.post("http://localhost:8080/login", {
          email: formData.email,
          password: formData.password,
        });

        const data = response.data;
        setMessage(data.message || "Success!");

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);

        setLoggedInUser(data.username);

        window.location.href = "/";
      } else {
        response = await axios.post("http://localhost:8080/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(
          error.response.data.error || "Something went wrong. Please try again."
        );
      } else {
        setMessage("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLoggedInUser(null);
    window.location.reload();
  };

  return (
    <div className="modal-overlay">
      <div className="login-signup-form">
        <button className="close-button" onClick={closeForm}>
          X
        </button>
        <img
          src="https://clipartcraft.com/images/google-logo-transparent-cute.png"
          alt="Login/Sign Up"
          className="form-image"
        />
        {!loggedInUser ? (
          !isForgotPassword ? (
            <>
              <h2>{isLogin ? "Login" : "Sign Up"}</h2>
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
                </button>
              </form>
              {message && <p className="form-message">{message}</p>}
              {isLogin && (
                <p className="forgot-password">
                  <button
                    className="forgot-password-button"
                    onClick={showForgotPassword}
                  >
                    Forgot Password?
                  </button>
                </p>
              )}
              <p>
                {isLogin ? "New user?" : "Already have an account?"}{" "}
                <button className="toggle-button" onClick={toggleForm}>
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </>
          ) : (
            <>
              <h2>Reset Password</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="reset-email">Email:</label>
                  <input
                    type="email"
                    id="reset-email"
                    name="resetEmail"
                    value={formData.resetEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Reset Password"}
                </button>
              </form>
              {message && <p className="form-message">{message}</p>}
              <p>
                Remembered your password?{" "}
                <button
                  className="toggle-button"
                  onClick={() => setIsForgotPassword(false)}
                >
                  Login
                </button>
              </p>
            </>
          )
        ) : (
          <>
            <h2>Welcome, {loggedInUser}!</h2>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginSignupForm;
