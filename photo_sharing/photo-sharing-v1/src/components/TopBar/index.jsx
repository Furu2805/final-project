import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import models from "../../modelData/models";
import axios from "axios"
import "./styles.css";
import UploadPhoto from "../UploadPhoto";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post('/admin/logout');
      onLogout();
      navigate('/login')
    }
    catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const handleUploadSuccess = (userId) => {
    window.location.href = `#/photos/${userId}`;
    window.location.reload();
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Typography variant="h5" color="inherit">
            Do Tung's Photo Sharing App
          </Typography>
          {user && (
            <UploadPhoto
              userId={user._id}
              onUploadSuccess={handleUploadSuccess}
            />
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user ? (
            <>
              <Typography variant="h6" color="inherit">
                Hi {user.first_name} {user.last_name}!
              </Typography>
              <Button
                color='inherit'
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Typography variant="h6" color="inherit">
              Please Login
            </Typography>
          )
          }
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
