<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import '../Css/LoginSignupForm.css'; // Ensure this path is correct
import '@fortawesome/fontawesome-free/css/all.min.css';

const LoginSignupForm = ({ closeForm }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [passwordAlert, setPasswordAlert] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [usernameExists, setUsernameExists] = useState('');
  const [requirements, setRequirements] = useState({
    length: false,
    specialChar: false,
    capitalLetter: false,
    number: false,
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    resetForm();
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setPasswordAlert('');
    setEmailError('');
    setUsernameError('');
    setUsernameExists('');
    setRequirements({ length: false, specialChar: false, capitalLetter: false, number: false });
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailPattern.test(email) ? '' : 'Please enter a valid email address.');
  };

  const evaluatePasswordRequirements = (password) => {
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isValidLength = password.length >= 8 && password.length <= 20;

    setRequirements({
      length: isValidLength,
      specialChar: hasSpecialChar,
      capitalLetter: hasCapitalLetter,
      number: hasNumber,
    });

    if (!isLogin && password.length === 0) {
      setPasswordAlert('');
    } else if (!isLogin && !isValidLength) {
      setPasswordAlert('Password must be between 8 and 20 characters long.');
    } else if (!isLogin && (!hasSpecialChar || !hasCapitalLetter || !hasNumber)) {
      setPasswordAlert('Password must include at least one special character, one uppercase letter, and one number.');
    } else {
      setPasswordAlert('');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    evaluatePasswordRequirements(newPassword);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (!isLogin && newUsername.trim() === '') {
      setUsernameError('Username is required for signup.');
    } else {
      setUsernameError('');
    }
    if (!isLogin) {
      try {
        const response = await fetch(`http://localhost:5000/check-username/${newUsername}`);
        const result = await response.json();
        if (response.ok && result.exists) {
          setUsernameExists('Username is already taken.');
        } else {
          setUsernameExists('');
        }
      } catch (error) {
        console.error('Error checking username:', error);
      }
    }
  };

  useEffect(() => {
    if (
      (isLogin || (requirements.length && requirements.specialChar && requirements.capitalLetter && requirements.number)) &&
      emailError === '' &&
      (isLogin || (usernameError === '' && usernameExists === ''))
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [requirements, emailError, usernameError, usernameExists, isLogin]);

  const submitForm = async (e) => {
    e.preventDefault();

    // Check if the form is valid before submitting
    if (!isFormValid) {
      alert('Please fill in all required fields correctly.');
      return; // Prevent submission
    }

    const endpoint = isLogin ? '/login' : '/signup';
    const requestData = {
      email,
      password,
      ...(isLogin ? {} : { username }),
    };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        alert('Successful!');
        closeForm();
      } else {
        alert(result.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-signup-form">
      <button className="close-button" onClick={closeForm}>&times;</button>
      <img
        src="https://clipartcraft.com/images/google-logo-transparent-cute.png"
        alt="Login/Sign Up"
        className="form-image"
      />
      {!isForgotPassword ? (
        <>
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <form onSubmit={submitForm}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={handleUsernameChange}
                  required={!isLogin}
                />
                {usernameError && <div className="error-message">{usernameError}</div>}
                {usernameExists && <div className="error-message">{usernameExists}</div>}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {emailError && <div className="error-message">{emailError}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {passwordAlert && <div className="error-message">{passwordAlert}</div>}
              {!isLogin && (
                <div className="password-requirements">
                  <p className={requirements.length ? 'valid' : 'invalid'}>
                    <i className={`fa ${requirements.length ? 'fa-check' : 'fa-times'}`}></i>
                    Between 8 and 20 characters
                  </p>
                  <p className={requirements.specialChar ? 'valid' : 'invalid'}>
                    <i className={`fa ${requirements.specialChar ? 'fa-check' : 'fa-times'}`}></i>
                    At least one special character
                  </p>
                  <p className={requirements.capitalLetter ? 'valid' : 'invalid'}>
                    <i className={`fa ${requirements.capitalLetter ? 'fa-check' : 'fa-times'}`}></i>
                    At least one capital letter
                  </p>
                  <p className={requirements.number ? 'valid' : 'invalid'}>
                    <i className={`fa ${requirements.number ? 'fa-check' : 'fa-times'}`}></i>
                    At least one number
                  </p>
                </div>
              )}
            </div>
            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>
          <button className="toggle-form-button" onClick={toggleForm}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </>
      ) : (
        <div>
          <h2>Forgot Password</h2>
          <p>Please contact support to reset your password.</p>
          <button onClick={() => setIsForgotPassword(false)}>Back to Login</button>
        </div>
      )}
    </div>
  );
};

export default LoginSignupForm;
>>>>>>> friend-repo/main
