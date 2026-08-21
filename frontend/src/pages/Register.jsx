import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import backgroundImage from './img/img4.jpg'; // Background image
import Navbar from './Navbar1'; // Use your desired navbar file
import Footer from './Footer';  // ✅ Import footer

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [fullNameValid, setFullNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);

  const fullNameRegex = /^[a-zA-Z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  const validateFullName = (input) => {
    const value = input.trim();
    if (!value) {
      setFullNameError('Full Name is required');
      setFullNameValid(false);
    } else if (!fullNameRegex.test(value)) {
      setFullNameError('Invalid full name');
      setFullNameValid(false);
    } else {
      setFullNameError('');
      setFullNameValid(true);
    }
  };

  const validateEmail = (input) => {
    const value = input.trim();
    if (!value) {
      setEmailError('Email is required');
      setEmailValid(false);
    } else if (!emailRegex.test(value)) {
      setEmailError('Invalid email address');
      setEmailValid(false);
    } else {
      setEmailError('');
      setEmailValid(true);
    }
  };

  const validateUsername = (input) => {
    const value = input.trim();
    if (!value) {
      setUsernameError('Username is required');
      setUsernameValid(false);
    } else {
      setUsernameError('');
      setUsernameValid(true);
    }
  };

  const validatePassword = (input) => {
    const value = input.trim();
    if (!value) {
      setPasswordError('Password is required');
      setPasswordValid(false);
    } else if (!passwordRegex.test(value)) {
      setPasswordError('Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one number');
      setPasswordValid(false);
    } else {
      setPasswordError('');
      setPasswordValid(true);
    }
  };

  const validateConfirmPassword = (input) => {
    if (input !== password) {
      setConfirmPasswordError('Passwords do not match');
      setConfirmPasswordValid(false);
    } else {
      setConfirmPasswordError('');
      setConfirmPasswordValid(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    validateFullName(fullName);
    validateEmail(email);
    validateUsername(username);
    validatePassword(password);
    validateConfirmPassword(confirmPassword);

    if (!fullNameValid || !emailValid || !usernameValid || !passwordValid || !confirmPasswordValid) return;

    registerUser(fullName, email, username, password, confirmPassword);
  };

  return (
    <>
      <Navbar />
      <div style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '8px',
          width: '500px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ marginBottom: '20px' }}>Sign Up</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <Label htmlFor="fullName">Full Name:</Label>
            <Input type="text" id="fullName" value={fullName} onChange={(e) => { setFullName(e.target.value); validateFullName(e.target.value); }}
              className="w-full"
              style={{ border: fullNameValid ? '2px solid green' : fullNameError ? '2px solid red' : '1px solid #ccc' }} />
            {fullNameError && <p style={{ color: 'red' }}>{fullNameError}</p>}

            {/* Username */}
            <Label htmlFor="username">Username:</Label>
            <Input type="text" id="username" value={username} onChange={(e) => { setUsername(e.target.value); validateUsername(e.target.value); }}
              className="w-full"
              style={{ border: usernameValid ? '2px solid green' : usernameError ? '2px solid red' : '1px solid #ccc' }} />
            {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}

            {/* Email */}
            <Label htmlFor="email">Email:</Label>
            <Input type="email" id="email" value={email} onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
              className="w-full"
              style={{ border: emailValid ? '2px solid green' : emailError ? '2px solid red' : '1px solid #ccc' }} />
            {emailError && <p style={{ color: 'red' }}>{emailError}</p>}

            {/* Password */}
            <Label htmlFor="password">Password:</Label>
            <Input type="password" id="password" value={password} onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }}
              className="w-full"
              style={{ border: passwordValid ? '2px solid green' : passwordError ? '2px solid red' : '1px solid #ccc' }} />
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}

            {/* Confirm Password */}
            <Label htmlFor="confirmPassword">Confirm Password:</Label>
            <Input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); validateConfirmPassword(e.target.value); }}
              className="w-full"
              style={{ border: confirmPasswordValid ? '2px solid green' : confirmPasswordError ? '2px solid red' : '1px solid #ccc' }} />
            {confirmPasswordError && <p style={{ color: 'red' }}>{confirmPasswordError}</p>}

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-[#0fb400] hover:bg-[#0bbf3a] text-white">
              Create Account
            </Button>

            <p style={{ marginTop: '15px', fontSize: '14px' }}>
              Already have an account? <Link to="/login" style={{ color: '#007bff' }}>Login</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
