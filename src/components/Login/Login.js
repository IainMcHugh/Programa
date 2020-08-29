import React, { useState, useEffect } from "react";
import fire from "../../API/Fire";
import logo from "../../images/program-fitness.png";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) return setError("Fields are empty");
    fire.login(email, password).catch((err) => {
      console.log(err);
      setError(err.message);
    });
  };

  return (
    <div className="background-container">
      <div className="login-form-container">
        <img className="logo-image" src={logo} alt="logo" />
        <div>
          <h3>Login</h3>
          <h4 className="login-error-container">{error}</h4>
        </div>
        <form className="login-form">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
          ></input>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
          ></input>
        </form>
        <div className="login-button-container">
          <button onClick={() => handleLogin()}>Login</button>
          <button onClick={() => props.toggle()} className="register-button">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
