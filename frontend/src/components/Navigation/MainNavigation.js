import React from "react";
import { NavLink, Link } from "react-router-dom";
import AuthContext from "../../context/auth-context";

import "./MainNavigation.css";

const MainNavigation = () => {
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <header className="main-navigation">
            <div className="main-navigation_logo">
              <h1>Easy Events</h1>
            </div>
            <nav className="main-navigation_items">
              <ul>
                {!context.token && (
                  <li>
                    <NavLink to="/auth">Login</NavLink>
                  </li>
                )}
                {context.token && (
                  <li>
                    <NavLink to="/events">Events</NavLink>
                  </li>
                )}
                {context.token && (
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                )}
                {context.token && (
                  <li>
                    <Link onClick={context.logout}>Logout</Link>
                  </li>
                )}
              </ul>
            </nav>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default MainNavigation;
