import AuthForm, { AuthField } from '../components/auth/AuthForm';
import useSubmission from '../hooks/useSubmission';
import { validateEmail, fieldErrors } from '../utils/formErrors';
import React, { useState, useContext } from 'react';

import AuthContext from '../context/AuthContext';

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { submitting, run } = useSubmission();
  const clearError = (field) => setErrors(previous => ({ ...previous, [field]: '', form: '' }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const nextErrors = {};
    if (!fullName.trim()) nextErrors.full_name = 'Full name is required.';
    if (!username.trim()) nextErrors.username = 'Username is required.';
    const emailError = validateEmail(email);
    if (emailError) nextErrors.email = emailError;
    if (!password) nextErrors.password = 'Password is required.';
    else if (password.length < 8) nextErrors.password = 'Password must contain at least 8 characters.';
    if (!confirmPassword) nextErrors.password2 = 'Confirm your password.';
    else if (password !== confirmPassword) nextErrors.password2 = 'Passwords do not match.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    await run(async () => {
      try {
        const result = await registerUser(fullName.trim(), email.trim(), username.trim(), password, confirmPassword);
        if (!result.ok) {
          const serverErrors = {};
          const generalErrors = [];
          Object.entries(fieldErrors(result.errors)).forEach(([field, message]) => {
            if (['full_name', 'username', 'email', 'password', 'password2'].includes(field)) serverErrors[field] = message;
            else generalErrors.push(message);
        });
        serverErrors.form = result.message || generalErrors.join(' ');
        setErrors(serverErrors);
      }
    } catch {
      setErrors({ form: 'Unable to connect. Please check your connection and try again.' });
    }
    });
  };

  return <AuthForm title="Create your account" description="Start with your first signs. Build meaningful connections." label="Registration"
    onSubmit={handleSubmit} submitting={submitting} submitLabel="Create Account" pendingLabel="Creating account…"
    error={errors.form} linkPrompt="Already have an account?" linkTo="/login" linkLabel="Login">
    {[
      { id: 'fullName', field: 'full_name', label: 'Full name', placeholder: 'Enter your full name', autoComplete: 'name', value: fullName, set: setFullName },
      { id: 'username', field: 'username', label: 'Username', placeholder: 'Choose a username', autoComplete: 'username', value: username, set: setUsername },
      { id: 'email', field: 'email', label: 'Email address', placeholder: 'you@example.com', type: 'email', autoComplete: 'email', value: email, set: setEmail },
      { id: 'password', field: 'password', label: 'Password', placeholder: 'At least 8 characters', type: 'password', autoComplete: 'new-password', value: password, set: setPassword },
      { id: 'confirmPassword', field: 'password2', label: 'Confirm password', placeholder: 'Re-enter your password', type: 'password', autoComplete: 'new-password', value: confirmPassword, set: setConfirmPassword },
    ].map(({ field, set, ...input }) => <AuthField key={field} {...input} type={input.type || 'text'}
      disabled={submitting} error={errors[field]} errorId={`error-${field}`}
      onChange={e => {
        set(e.target.value);
        clearError(field);
        if (field === 'password') clearError('password2');
      }} />)}
  </AuthForm>;
};

export default Register;
