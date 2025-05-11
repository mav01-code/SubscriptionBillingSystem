import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import PaymentPlans from './components/PaymentPlans';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Success from './components/Success';
import { getCurrentUser, signOut } from './auth/cognito';
import './App.css';

function App() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const plans = [
    { name: "Basic", price: "$10/month", features: ["✔️ 5GB Storage", "✔️ Single User", "❌ No Priority Support"] },
    { name: "Pro", price: "$20/month", features: ["✔️ 50GB Storage", "✔️ Up to 5 Users", "✔️ Priority Support"] },
    { name: "Premium", price: "$30/month", features: ["✔️ 200GB Storage", "✔️ Unlimited Users", "✔️ 24/7 Support"] }
  ];

  const handlePayment = async () => {
    if (!user) {
      navigate('/signin', { state: { fromPayment: true } });
      return;
    }
    try {
      console.log('Processing payment for:', user.username, selectedPlan);
      navigate('/success'); // ✅ Redirect to success page after payment
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="app loading">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <nav className="auth-nav">
          {user ? (
            <>
              {/* <span className="welcome-message">Welcome, {user.username}</span>
              <button onClick={handleSignOut} className="sign-out-btn">
                Sign Out
              </button> */}
            </>
          ) : (
            <div className="auth-links">
              <Link to="/signin" className="auth-link">Sign In</Link>
              <span className="divider">|</span>
              <Link to="/signup" className="auth-link">Sign Up</Link>
            </div>
          )}
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <PaymentPlans
                plans={plans}
                selectedPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
                onPayment={handlePayment}
                isAuthenticated={!!user}
              />
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/dashboard" replace />} />
          <Route path="/success" element={<Success />} /> {/* ✅ Success route */}
        </Routes>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Subscription Billing System</p>
      </footer>
    </div>
  );
}

export default App;
