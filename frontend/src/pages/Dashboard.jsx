import React, { useContext } from 'react';
import { Typography, Card, CardContent, Button, Box } from '@mui/material';
import { FaUser, FaEnvelope, FaIdBadge, FaClock, FaCog, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AuthContext from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import bgi from './img/image4.png';

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
    <div className="bg-cover bg-center min-h-screen flex flex-col" style={{ backgroundImage: `url(${bgi})` }}>
      <Navbar />
      <div className="pt-[100px] px-5 pb-10 max-w-[1000px] mx-auto flex-1">
        <Typography variant="h3" className="text-[2rem] md:text-[2.5rem] font-bold text-center text-white mb-10 [text-shadow:2px_2px_6px_rgba(0,0,0,0.3)]">
          Welcome, {username}
        </Typography>

        <Box className="flex justify-center mb-[30px]">
          <Card className="bg-[rgba(255,255,255,0.9)] p-[30px] rounded-[12px] w-full">
            <CardContent className="flex flex-col gap-[15px]">
              <div className="flex items-center text-[1.1rem] text-[#444]"><FaUser className="mr-[10px] text-[#333]" /><span className="font-bold mr-2 text-[#333]">Username:</span> {username}</div>
              <div className="flex items-center text-[1.1rem] text-[#444]"><FaIdBadge className="mr-[10px] text-[#333]" /><span className="font-bold mr-2 text-[#333]">User ID:</span> {user_id}</div>
              <div className="flex items-center text-[1.1rem] text-[#444]"><FaUser className="mr-[10px] text-[#333]" /><span className="font-bold mr-2 text-[#333]">Full Name:</span> {full_name}</div>
              <div className="flex items-center text-[1.1rem] text-[#444]"><FaEnvelope className="mr-[10px] text-[#333]" /><span className="font-bold mr-2 text-[#333]">Email:</span> {email}</div>
              <div className="flex items-center text-[1.1rem] text-[#444]"><FaClock className="mr-[10px] text-[#333]" /><span className="font-bold mr-2 text-[#333]">Token Validity:</span> {tokenValidityDuration} minutes</div>
            </CardContent>
          </Card>
        </Box>

        <div className="flex flex-wrap gap-[15px] justify-center mt-5">
          {/* <Button variant="outlined" color="primary">
            <Link to="/profile" className="no-underline text-[#007bff] font-bold">Upload / Change Profile</Link>
          </Button> */}
          <Button variant="contained" color="primary" onClick={() => window.location.href = '/payment'}>
            Continue to Course Payment
          </Button>
          <Button variant="contained" color="secondary">
            <Link to="/attendance" className="no-underline text-white font-bold">View Attendance Records</Link>
          </Button>
        </div>

        <div className="mt-[30px] text-center">
          <ul className="list-none p-0">
            <li className="mb-[15px]">
              <Link to="/settings" className="no-underline text-[#333] text-[1.1rem] inline-flex items-center hover:text-[#007BFF]"><FaCog className="mr-[10px] text-[#333]" /> Settings</Link>
            </li>
            <li className="mb-[15px]">
              <Link to="/progress" className="no-underline text-[#333] text-[1.1rem] inline-flex items-center hover:text-[#007BFF]"><FaChartLine className="mr-[10px] text-[#333]" /> Progress</Link>
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
