/* eslint-disable prettier/prettier */
//import React from 'react';
import "./LoginPage.css";

function LoginPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add login logic here
  };

  return (
    <div className="login-container">
      <h1>Welcome to PharmaPulse</h1>
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
            <span className="forgot-password">*Forgot Password*</span>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
