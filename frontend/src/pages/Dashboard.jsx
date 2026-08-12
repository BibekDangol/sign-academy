import React, { useContext } from 'react';
import { Typography, Card, CardContent, Button, Box } from '@mui/material';
import { FaUser, FaEnvelope, FaIdBadge, FaClock, FaCog, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AuthContext from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import bgi from './img/image4.png';
import './Dashboard.css';

const Dashboard = () => {
  const { logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");

  const decode = jwtDecode(token);
  const user_id = decode.user_id;
  const username = decode.username;
  const email = decode.email;
  const full_name = decode.full_name;
  const tokenExpiry = new Date(decode.exp * 1000);
  const tokenValidityDuration = Math.floor((tokenExpiry - Date.now()) / (1000 * 60));

  return (
    <div className="dashboard-page" style={{ backgroundImage: `url(${bgi})` }}>
      <Navbar />
      <div className="dashboard-content">
        <Typography variant="h3" className="dashboard-title">
          Welcome, {username}
        </Typography>

        <Box className="info-box">
          <Card className="dashboard-card">
            <CardContent className="dashboard-card-content">
              <div className="info-row"><FaUser className="icon" /><span className="label">Username:</span> {username}</div>
              <div className="info-row"><FaIdBadge className="icon" /><span className="label">User ID:</span> {user_id}</div>
              <div className="info-row"><FaUser className="icon" /><span className="label">Full Name:</span> {full_name}</div>
              <div className="info-row"><FaEnvelope className="icon" /><span className="label">Email:</span> {email}</div>
              <div className="info-row"><FaClock className="icon" /><span className="label">Token Validity:</span> {tokenValidityDuration} minutes</div>
            </CardContent>
          </Card>
        </Box>

        <div className="dashboard-buttons">
          {/* <Button variant="outlined" color="primary">
            <Link to="/profile" className="btn-link">Upload / Change Profile</Link>
          </Button> */}
          <Button variant="contained" color="primary" onClick={() => window.location.href = '/payment'}>
            Continue to Course Payment
          </Button>
          <Button variant="contained" color="secondary">
            <Link to="/attendance" className="btn-link white">View Attendance Records</Link>
          </Button>
        </div>

        <div className="dashboard-links">
          <ul>
            <li>
              <Link to="/settings" className="settings-link"><FaCog className="icon" /> Settings</Link>
            </li>
            <li>
              <Link to="/progress" className="settings-link"><FaChartLine className="icon" /> Progress</Link>
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
