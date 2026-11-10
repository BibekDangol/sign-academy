import { fieldErrors } from '../utils/formErrors';
import PageLayout from '../components/layout/PageLayout';
import React, { useState, useContext, useRef } from 'react';
import useAxios from "../utils/useAxios";
import {
  Typography, TextField, Button, Grid, Card, CardContent, Tab, Tabs, Box
} from '@mui/material';
import { AccountCircle, VpnKey } from '@mui/icons-material';
import bgi from './img/image4.png';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, applyProfileAccess, getSessionId, clearSession } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileValues, setProfileValues] = useState(() => ({
    username: user?.username || '', full_name: user?.full_name || '', email: user?.email || '', bio: user?.bio || '',
  }));
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const busyRef = useRef(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const api = useAxios();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (busyRef.current) return;
    setChangePasswordError(null);

    if (newPassword !== confirmPassword) {
      setChangePasswordError("New password and confirm password do not match.");
      return;
    }

    busyRef.current = true;
    setChangingPassword(true);
    const sessionId = getSessionId();
    try {
      await api.put('change-password/', {
        old_password: oldPassword,
        new_password: newPassword
      });

      if (getSessionId() !== sessionId) return;

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setChangePasswordError(null);

      clearSession();
      navigate('/login', { replace: true });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Password changed. Please sign in again on all devices.',
      });
    } catch (error) {
      const data = error.response?.data;
      const detail = data?.detail || data?.new_password?.[0] || data?.old_password?.[0] || "Failed to change password.";
      setChangePasswordError(detail);
    } finally {
      busyRef.current = false;
      setChangingPassword(false);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (busyRef.current) return;
    setProfileErrors({});
    busyRef.current = true;
    setSavingProfile(true);
    const sessionId = getSessionId();
    try {
      const response = await api.put('edit-profile/', profileValues);
      applyProfileAccess(response.data.access, sessionId);
      setProfileValues(previous => ({ ...previous, ...Object.fromEntries(
        ['username', 'email', 'full_name', 'bio'].map(field => [field, response.data[field]]),
      ) }));
      Swal.fire({ icon: 'success', title: 'Profile updated', text: 'Your changes are saved.' });
    } catch (error) {
      const data = error.response?.data;
      const errors = fieldErrors(data);
      if (!Object.keys(errors).length) errors.detail = 'Unable to save your profile. Please try again.';
      setProfileErrors(errors);
    } finally {
      busyRef.current = false;
      setSavingProfile(false);
    }
  };

  return (
    <PageLayout>
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
                  <form onSubmit={handleChangePassword} aria-label="Change password">
                    <Typography variant="body2">Changing your password signs you out on all devices.</Typography>
                    <TextField fullWidth label="Old Password" type="password" autoComplete="current-password" disabled={changingPassword || savingProfile} value={oldPassword} required onChange={(e) => setOldPassword(e.target.value)} margin="normal" />
                    <TextField fullWidth label="New Password" type="password" autoComplete="new-password" disabled={changingPassword || savingProfile} value={newPassword} required onChange={(e) => setNewPassword(e.target.value)} margin="normal" />
                    <TextField fullWidth label="Confirm New Password" type="password" autoComplete="new-password" disabled={changingPassword || savingProfile} value={confirmPassword} required onChange={(e) => setConfirmPassword(e.target.value)} margin="normal" />
                    {changePasswordError && <Typography role="alert" color="error" sx={{ mt: 1 }}>{changePasswordError}</Typography>}
                    <Button type="submit" disabled={changingPassword || savingProfile} variant="contained" fullWidth sx={{ mt: 2 }}>
                      {changingPassword ? 'Changing password…' : 'Change Password'}
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
                  <form onSubmit={handleEditProfile} aria-label="Edit profile">
                    {[
                      { name: 'full_name', label: 'Full Name', maxLength: 100 },
                      { name: 'username', label: 'Username', maxLength: 150 },
                      { name: 'email', label: 'Email', type: 'email', maxLength: 254 },
                      { name: 'bio', label: 'Bio', maxLength: 1000 },
                    ].map(field => <TextField key={field.name} fullWidth margin="normal"
                      label={field.label} type={field.type || 'text'} multiline={field.name === 'bio'}
                      minRows={field.name === 'bio' ? 3 : undefined} required={field.name !== 'bio'}
                      inputProps={{ maxLength: field.maxLength }} disabled={savingProfile || changingPassword}
                      value={profileValues[field.name]} error={Boolean(profileErrors[field.name])}
                      helperText={profileErrors[field.name]}
                      onChange={e => {
                        setProfileValues(previous => ({ ...previous, [field.name]: e.target.value }));
                        setProfileErrors(previous => ({ ...previous, [field.name]: '', detail: '' }));
                      }} />)}
                    {profileErrors.detail && <Typography role="alert" color="error">{profileErrors.detail}</Typography>}
                    <Button type="submit" disabled={savingProfile || changingPassword} variant="contained" fullWidth sx={{ mt: 2 }}>
                      {savingProfile ? 'Saving…' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
      </PageLayout>
  );
};

export default Settings;
