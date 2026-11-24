import AuthForm, { AuthField } from '../components/auth/AuthForm';
import useSubmission from '../hooks/useSubmission';
import { validateEmail, fieldErrors, errorMessage } from '../utils/formErrors';
import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const { submitting, run } = useSubmission();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const normalizedEmail = email.trim();
    const nextEmailError = validateEmail(normalizedEmail);
    const nextPasswordError = !password ? 'Password is required.' : '';
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError('');
    if (nextEmailError || nextPasswordError) return;

    await run(async () => {
      try {
        const from = location.state?.from;
        const result = from ? await loginUser(normalizedEmail, password, from) : await loginUser(normalizedEmail, password);
        if (!result.ok) {
          const errors = fieldErrors(result.errors);
          setEmailError(errorMessage(errors.email));
          setPasswordError(errorMessage(errors.password));
          setFormError(result.message || errorMessage(errors.non_field_errors || errors.detail) ||
            (!errors.email && !errors.password ? 'Unable to log in. Please try again.' : ''));
        }
      } catch {
        setFormError('Unable to connect. Please check your connection and try again.');
      }
    });
  };

  return <AuthForm title="Welcome back" description="Log in to continue your learning journey." label="Login"
    onSubmit={handleSubmit} submitting={submitting} submitLabel="Login" pendingLabel="Logging in…"
    error={formError} linkPrompt="Don’t have an account?" linkTo="/register" linkLabel="Sign up">
    <AuthField id="email" label="Email address" placeholder="you@example.com" type="email" autoComplete="email" disabled={submitting}
      error={emailError} errorId="login-email-error" value={email}
      onChange={e => { setEmail(e.target.value); setEmailError(''); setFormError(''); }} />
    <AuthField id="password" label="Password" placeholder="Enter your password" type="password" autoComplete="current-password" disabled={submitting}
      error={passwordError} errorId="login-password-error" value={password}
      onChange={e => { setPassword(e.target.value); setPasswordError(''); setFormError(''); }} />
  </AuthForm>;
};

export default Login;
