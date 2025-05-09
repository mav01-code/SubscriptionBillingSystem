import React, { useState } from 'react';
import { signIn } from '../auth/cognito';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [requiresNewPassword, setRequiresNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn(email, password);
      
      if (result.requiresNewPassword) {
        setRequiresNewPassword(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Sign in failed');
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    try {
      const cognitoUser = await signIn(email, newPassword);
      if (cognitoUser) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Password change failed');
    }
  };

  return (
    <div className="auth-form">
      <h2>Sign In</h2>
      {error && <div className="error">{error}</div>}

      {!requiresNewPassword ? (
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Sign In</button>
        </form>
      ) : (
        <form onSubmit={handleNewPassword}>
          <p>Please set a new password</p>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            minLength="8"
            required
          />
          <button type="submit">Change Password</button>
        </form>
      )}

      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
      <p>
        <a href="/forgot-password">Forgot password?</a>
      </p>
    </div>
  );
}

export default SignIn;