import React, { useState } from "react";
import fire from "../../API/Fire";
import logo from "../../images/program-fitness.png";

interface Props {
  toggle: () => void;
}

const Register: React.FC<Props> = (props) => {
  const [email, setEmail] = useState<string>("");
  const [userHandle, setUserHandle] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repwd, setRepwd] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleRegister = () => {
    if (!email || !userHandle || !password || !repwd) {
      setError("Fields are empty");
    } else if (password !== repwd) {
      setError("Passwords do not match");
    } else {
      fire
        .register(email, password)
        .then((newUser) => {
          if(newUser) fire.addNewUser(newUser.user, email, userHandle);
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
        });
    }
  };

  return (
    <div className="background-container">
      <div className="login-form-container">
        <img className="logo-image" src={logo} alt="logo" />
        <div>
          <h3>Register</h3>
          <h4 className="reg-error-container">{error}</h4>
        </div>
        <form className="login-form">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
          ></input>
          <label>UserHandle:</label>
          <input
            type="text"
            value={userHandle}
            onChange={(e) => setUserHandle(e.target.value)}
            name="userhandle"
          ></input>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
          ></input>
          <label>Re-enter password:</label>
          <input
            type="password"
            value={repwd}
            onChange={(e) => setRepwd(e.target.value)}
            name="repassword"
          ></input>
        </form>
        <div className="login-button-container">
          <button onClick={() => handleRegister()}>Login</button>
          <button onClick={() => props.toggle()} className="goback-button">
            Already a User?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
