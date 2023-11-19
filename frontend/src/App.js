import {
  BrowserRouter,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import AuthPage from "./pages/Auth";
import EventsPage from "./pages/Events";
import BookingsPage from "./pages/Bookings";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";

import "./App.css";
import { Component } from "react";

class App extends Component {
  state = {
    token: null,
    userId: null,
  };
  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };
  logout = () => {
    this.setState({ token: null, userId: null });
  };
  render() {
    return (
      <BrowserRouter className="App">
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}
        >
          <MainNavigation />
          <div className="main-content">
            <Routes>
              {!this.state.token && <Route path="/" element={<Navigate replace to="/auth" />} />}
              {!this.state.token && <Route path="/events" element={<Navigate replace to="/auth" />} />}
              {!this.state.token && <Route path="/bookings" element={<Navigate replace to="/auth" />} />}
              {this.state.token && <Route path="/" element={<Navigate replace to="/events" />} />}
              {this.state.token && <Route path="/auth" element={<Navigate replace to="/events" />} />}
              {!this.state.token && <Route path="/auth" element={<AuthPage />} />}
              {this.state.token && <Route path="/events" element={<EventsPage />} />}
              {this.state.token && <Route path="/bookings" element={<BookingsPage />} />}
            </Routes>
          </div>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
