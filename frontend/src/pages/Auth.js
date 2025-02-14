import React, { Component } from "react";
import AuthConetext from '../context/auth-context';

import "./auth.css";

class AuthPage extends Component {
  state = {
    isLogin: true,
  };

  static contextType = AuthConetext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchFormHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
          query {
            login(email: "${email}", password: "${password}") {
              userId
              token
              tokenExpiration
            }
          }
        `,
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
                  mutation {
                          createUser(userInput: {email: "${email}", password: "${password}"}){
                              _id
                              email
                          }
                      }
                  `,
      };
    }

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 200) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token){
            this.context.login(
                resData.data.login.token,
                resData.data.login.userId,
                resData.data.login.tokenExpiration
                );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchFormHandler}>
            {this.state.isLogin ? "Sign up" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
