import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import backgroundImage from './img/loginimg.jpg';
import Navbar from './Navbar1';
import Footer from './Footer'; // ✅ Include Footer

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  const validateEmail = (value) => {
    if (!value) {
      setEmailError('Email is required');
      setEmailValid(false);
    } else if (!emailRegex.test(value)) {
      setEmailError('Invalid email format');
      setEmailValid(false);
    } else {
      setEmailError('');
      setEmailValid(true);
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError('Password is required');
      setPasswordValid(false);
    } else if (!passwordRegex.test(value)) {
      setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, and a number');
      setPasswordValid(false);
    } else {
      setPasswordError('');
      setPasswordValid(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateEmail(email);
    validatePassword(password);

    if (!emailValid || !passwordValid) return;

    const response = await loginUser(email, password);
    if (!response?.token) {
      console.error('Login failed');
    }
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
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '8px',
          width: '450px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ marginBottom: '20px' }}>Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <Label htmlFor="email">Email:</Label>
            <div style={{ position: 'relative' }}>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                className="w-full"
                style={{
                  border: emailValid ? '2px solid green' : emailError ? '2px solid red' : '1px solid #ccc'
                }}
              />
              {emailValid && (
                <FontAwesomeIcon icon={faCheck} style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  color: 'green'
                }} />
              )}
            </div>
            {emailError && <p style={{ color: 'red' }}>{emailError}</p>}

            {/* Password */}
            <Label htmlFor="password">Password:</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              className="w-full"
              style={{
                border: passwordValid ? '2px solid green' : passwordError ? '2px solid red' : '1px solid #ccc'
              }}
            />
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-[#0fb400] hover:bg-[#0bbf3a] text-white">
              Login
            </Button>

            <p style={{ marginTop: '15px', fontSize: '14px' }}>
              Don’t have an account? <Link to="/register" style={{ color: '#007bff' }}>Register</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
