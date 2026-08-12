import React, { useState, useContext, useEffect } from 'react';
import useAxios from "../utils/useAxios";
import { jwtDecode } from 'jwt-decode';
import {
  Typography, TextField, Button, Grid, Card, CardContent, Tab, Tabs, Box
} from '@mui/material';
import { AccountCircle, VpnKey } from '@mui/icons-material';
import Navbar from './Navbar';
import Footer from './footer1';
import bgi from './img/image4.png';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext';

const Settings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const api = useAxios();
  const token = localStorage.getItem("authTokens");
  const { logoutUser } = useContext(AuthContext);

  const decoded = jwtDecode(token);
  const username = decoded.username;

  let inactivityTimer;

  const handleInactivityLogout = () => {
    logoutUser();
    clearTimeout(inactivityTimer);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setChangePasswordError("New password and confirm password do not match.");
      return;
    }

    try {
      await api.put('http://127.0.0.1:8000/api/change-password/', {
        old_password: oldPassword,
        new_password: newPassword
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setChangePasswordError(null);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Password changed successfully!',
      });
    } catch (error) {
      console.error("Change password error:", error);
      const data = error.response?.data;
      const detail = data?.detail || data?.new_password?.[0] || data?.old_password?.[0] || "Failed to change password.";
      setChangePasswordError(detail);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('http://127.0.0.1:8000/api/edit-profile/', {
        username: newUsername
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully! Please log in again to see changes.',
      });
    } catch (error) {
      console.error("Edit profile error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.detail || 'An error occurred while updating profile.',
      });
    }
  };

  useEffect(() => {
    const checkTokenValidity = () => {
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          logoutUser();
        }
      }
    };

    inactivityTimer = setTimeout(handleInactivityLogout, 60 * 60 * 1000); // 1 hour
    checkTokenValidity();

    return () => clearTimeout(inactivityTimer);
  }, [token, logoutUser]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          pt: "120px",
          pb: "100px",
          backgroundImage: `url(${bgi})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: 600, color: "#111" }}>
          Account Settings
        </Typography>

        <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)} centered sx={{ mt: 2 }}>
          <Tab icon={<VpnKey />} label="Change Password" />
          <Tab icon={<AccountCircle />} label="Edit Profile" />
        </Tabs>

        <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            {tabValue === 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center" gutterBottom>
                    Change Password
                  </Typography>
                  <form onSubmit={handleChangePassword}>
                    <TextField fullWidth label="Old Password" type="password" value={oldPassword} required onChange={(e) => setOldPassword(e.target.value)} margin="normal" />
                    <TextField fullWidth label="New Password" type="password" value={newPassword} required onChange={(e) => setNewPassword(e.target.value)} margin="normal" />
                    <TextField fullWidth label="Confirm New Password" type="password" value={confirmPassword} required onChange={(e) => setConfirmPassword(e.target.value)} margin="normal" />
                    {changePasswordError && <Typography color="error" sx={{ mt: 1 }}>{changePasswordError}</Typography>}
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                      Change Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {tabValue === 1 && (
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center" gutterBottom>
                    Edit Profile
                  </Typography>
                  <form onSubmit={handleEditProfile}>
                    <TextField fullWidth label="Current Username" value={username} disabled margin="normal" />
                    <TextField fullWidth label="New Username" placeholder={`e.g. ${username}`} value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required margin="normal" />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default Settings;
