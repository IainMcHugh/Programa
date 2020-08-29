import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../images/program-fitness.png";

class Navigation extends Component {
  render() {
    return (
      <div className="header-container">
        <div className="header-logo">
          <img className="logo-image" src={logo} alt="logo" />
        </div>
        <div className="header-menu">
          <ul>
            <li>
              <NavLink
                exact
                activeClassName="header-menu-active"
                to="/programs"
              >
                Programs
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="header-menu-active"
                to="/exercises"
              >
                Exercises
              </NavLink>
            </li>
            <li>
              <NavLink exact activeClassName="header-menu-active" to="/routine">
                Routine
              </NavLink>
            </li>
            <li>
              <NavLink exact activeClassName="header-menu-active" to="/profile">
                Profile
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Navigation;
