import React, { useState } from 'react';
import { signUp, verifyAccount } from '../auth/cognito';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      setShowVerification(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Sign up failed');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyAccount(email, verificationCode);
      navigate('/signin');
    } catch (err) {
      setError(err.message || 'Verification failed');
    }
  };

  return (
    <div className="auth-form">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}

      {!showVerification ? (
        <form onSubmit={handleSignUp}>
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
            minLength="8"
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <p>Verification code sent to {email}</p>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Verification Code"
            required
          />
          <button type="submit">Verify Account</button>
        </form>
      )}

      <p>
        Already have an account? <a href="/signin">Sign In</a>
      </p>
    </div>
  );
}

export default SignUp;