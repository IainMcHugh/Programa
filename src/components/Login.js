import React, { Component } from "react";
import fire from "./Fire";
import logo from "../images/program-fitness.png";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      reg_email: "",
      reg_username: "",
      reg_password: "",
      reg_repassword: "",
      isLoginVisible: true,
      isRegisterVisible: false,
      isGoing: false,
    };
  }

  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  login = (e) => {
    e.preventDefault();
    if (this.state.email === "" || this.state.password === "") {
      document.querySelector(".login-error-container").innerHTML =
        "Fields are empty";
    } else {
      fire
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((u) => {
          console.log(u);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  register = (e) => {
    e.preventDefault();
    if (
      this.state.reg_email === "" ||
      this.state.reg_username === "" ||
      this.state.reg_password === "" ||
      this.state.reg_repassword === ""
    ) {
      document.querySelector(".reg-error-container").innerHTML =
        "Fields are empty";
    } else if (this.state.reg_password !== this.state.reg_repassword) {
      document.querySelector(".reg-error-container").innerHTML =
        "Passwords do not match!";
      this.setState({
        reg_password: "",
        reg_repassword: "",
      });
    } else {
      fire
        .auth()
        .createUserWithEmailAndPassword(
          this.state.reg_email,
          this.state.reg_password
        )
        .then((u) => {
          console.log(u);
          // get user and add to database?
          var database = fire.database();
          database.ref("users/" + fire.auth().currentUser.uid).set({
            email: this.state.reg_email,
            username: this.state.reg_username,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  toggleLoginContainer = () => {
    document.querySelector(".login-error-container").innerHTML = "";
    this.setState((prevState) => ({
      isGoing: !prevState.isGoing,
    }));
    setTimeout(() => {
      this.setState((prevState) => ({
        isLoginVisible: !prevState.isLoginVisible,
      }));
    }, 300);
    setTimeout(() => {
      this.setState((prevState) => ({
        isRegisterVisible: !prevState.isRegisterVisible,
      }));
    }, 300);
  };

  toggleRegisterContainer = () => {
    document.querySelector(".reg-error-container").innerHTML = "";
    this.setState((prevState) => ({
      isGoing: !prevState.isGoing,
    }));
    setTimeout(() => {
      this.setState((prevState) => ({
        isRegisterVisible: !prevState.isRegisterVisible,
      }));
    }, 300);

    setTimeout(() => {
      this.setState((prevState) => ({
        isLoginVisible: !prevState.isLoginVisible,
      }));
    }, 300);
  };

  render() {
    const { isLoginVisible, isRegisterVisible, isGoing } = this.state;
    return (
      <div className="background-container">
        <div
          className={`login-form-container ${
            isLoginVisible ? "visible" : "hidden"
          } ${isGoing ? "going" : ""}`}
        >
          <img className="logo-image" src={logo} alt="logo" />
          <div>
            <h3>Login</h3>
            <div className="login-error-container"></div>
          </div>
          <form className="login-form">
            <label>Email:</label>
            <input
              type="email"
              value={this.state.email}
              onChange={this.changeHandler}
              name="email"
            ></input>
            <label>Password:</label>
            <input
              type="password"
              value={this.state.password}
              onChange={this.changeHandler}
              name="password"
            ></input>
          </form>
          <div className="login-button-container">
            <button type="submit" onClick={this.login}>
              Login
            </button>
            <button
              onClick={this.toggleLoginContainer}
              className="register-button"
            >
              Register
            </button>
          </div>
        </div>
        <div
          className={`login-form-container ${
            isRegisterVisible ? "visible" : "hidden"
          } ${!isGoing ? "going" : ""}`}
        >
          <img className="logo-image" src={logo} alt="logo" />
          <div>
            <h3>Register</h3>
            <div className="reg-error-container"></div>
          </div>
          <form className="login-form">
            <label>Email:</label>
            <input
              type="email"
              value={this.state.reg_email}
              onChange={this.changeHandler}
              name="reg_email"
            ></input>
            <label>UserHandle:</label>
            <input
              type="text"
              value={this.state.reg_username}
              onChange={this.changeHandler}
              name="reg_username"
            ></input>
            <label>Password:</label>
            <input
              type="password"
              value={this.state.reg_password}
              onChange={this.changeHandler}
              name="reg_password"
            ></input>
            <label>Re-enter password:</label>
            <input
              type="password"
              value={this.state.reg_repassword}
              onChange={this.changeHandler}
              name="reg_repassword"
            ></input>
          </form>
          <div className="login-button-container">
            <button type="submit" onClick={this.register}>
              Login
            </button>
            <button
              onClick={this.toggleRegisterContainer}
              className="goback-button"
            >
              Already a User?
            </button>
          </div>
        </div>
        <div className="login-background-text">
          Programs <br />
          just <br />
          for <br />
          you
        </div>
        <div className="login-preview">
          <div className="login-preview-menu">Programs</div>
        </div>
      </div>
    );
  }
}

export default Login;
