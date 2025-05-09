import React, { useState, useEffect } from 'react';
import { getCurrentUser, signOut } from '../auth/cognito';
import { useNavigate } from 'react-router-dom';
import PaymentPlans from './PaymentPlans';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const plans = [
    {
      id: 1,
      name: "Basic",
      price: "$10/month",
      features: [
        "✔️ 5GB Storage",
        "✔️ Single User",
        "❌ No Priority Support"
      ]
    },
    {
      id: 2,
      name: "Pro",
      price: "$20/month",
      features: [
        "✔️ 50GB Storage",
        "✔️ Up to 5 Users",
        "✔️ Priority Support"
      ]
    },
    {
      id: 3,
      name: "Premium",
      price: "$30/month",
      features: [
        "✔️ 200GB Storage",
        "✔️ Unlimited Users",
        "✔️ 24/7 Support"
      ]
    }
  ];

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        const displayName = currentUser.attributes?.email?.split('@')[0] || 
                          currentUser.username.split('@')[0] || 
                          'User';
        setUser({
          ...currentUser,
          displayName
        });
      } catch (error) {
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handlePayment = () => {
    if (selectedPlan) {
      // Add your payment processing logic here
      console.log('Proceeding to payment for:', selectedPlan.name);
      // navigate('/payment'); // Uncomment when you have a payment route
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user.displayName}</h1>
        <button onClick={handleSignOut} className="sign-out-btn">
          Sign Out
        </button>
      </header>
      
      <main className="dashboard-content">
        <PaymentPlans 
          plans={plans} 
          onPlanSelect={handlePlanSelect} 
          selectedPlanId={selectedPlan?.id} 
        />
        
        {selectedPlan && (
          <div className="payment-actions">
            <button 
              onClick={handlePayment}
              className="proceed-btn"
            >
              Proceed to Payment - {selectedPlan.name} Plan
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;