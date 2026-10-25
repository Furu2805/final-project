import './App.css';

import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

const App = (props) => {

  const [currentUser, setCurrentUser] = useState(null);

  //Load user nếu trong sessionStorage có lưu
  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  }
  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar user={currentUser} onLogout={handleLogout} />
          </Grid>
          <div className="main-topbar-buffer" />

          {currentUser && (
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid>
          )}

          <Grid item sm={currentUser ? 9 : 12}>
            <Paper className="main-grid-item">
              <Routes>
                {/* ROUTE LOGIN */}
                <Route
                  path="/login"
                  element={
                    currentUser ?
                      <Navigate to={`/users/${currentUser._id}`} /> :
                      <LoginRegister onLogin={handleLogin} />
                  }
                />

                {/* route cần login */}
                <Route
                  path="/users/:userId"
                  element={currentUser ? <UserDetail currentUser={currentUser} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/photos/:userId"
                  element={currentUser ? <UserPhotos currentUser={currentUser} /> : <Navigate to="/login" />}
                />

                {/* route mặc định */}
                <Route
                  path="/"
                  element={<Navigate to={currentUser ? `/users/${currentUser._id}` : "/login"} />}
                />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
}

export default App;
