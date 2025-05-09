import React, { useState, useEffect } from 'react';
import './PaymentPlans.css';

// Initialize Stripe with enhanced error handling
const initializeStripe = async () => {
  try {
    // Verify the public key exists before loading
    if (!process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
      throw new Error('Stripe public key is missing');
    }

    // Dynamically import Stripe with error handling
    let stripeModule;
    try {
      stripeModule = await import('@stripe/stripe-js');
    } catch (err) {
      throw new Error('Failed to load Stripe library');
    }

    if (!stripeModule || !stripeModule.loadStripe) {
      throw new Error('Stripe library is not properly loaded');
    }

    const stripeInstance = await stripeModule.loadStripe(
      process.env.REACT_APP_STRIPE_PUBLIC_KEY
    );

    if (!stripeInstance) {
      throw new Error('Failed to initialize Stripe');
    }

    return stripeInstance;
  } catch (err) {
    console.error('Stripe initialization error:', err);
    throw err;
  }
};

// Global stripe promise
let stripePromise;

const PaymentPlans = ({ plans = [], onPlanSelect, selectedPlanId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [stripe, setStripe] = useState(null);
  const [stripeLoaded, setStripeLoaded] = useState(false);

  // Load Stripe when component mounts
  useEffect(() => {
    let isMounted = true;

    const loadStripeInstance = async () => {
      try {
        if (!stripePromise) {
          stripePromise = initializeStripe();
        }

        const stripeInstance = await stripePromise;
        if (isMounted) {
          setStripe(stripeInstance);
          setStripeLoaded(true);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Payment system error:', err);
          setError('Payment system unavailable. Please try again later.');
          setStripeLoaded(true);
        }
      }
    };

    loadStripeInstance();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProceedToPayment = async () => {
    if (!selectedPlanId) {
      setError('Please select a plan first');
      return;
    }

    if (!stripe) {
      setError('Payment system is not available');
      return;
    }

    const selectedPlan = plans.find(plan => plan.id === selectedPlanId);
    if (!selectedPlan) {
      setError('Invalid plan selected');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: selectedPlan.name,
          price: selectedPlan.price,
          planId: selectedPlan.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment session creation failed');
      }

      const { id: sessionId } = await response.json();
      
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      
      if (stripeError) {
        throw stripeError;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="plans-container">
      <h2>Choose Your Plan</h2>
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="dismiss-error">
            ×
          </button>
        </div>
      )}
      
      <div className="plans-grid">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`plan-card ${selectedPlanId === plan.id ? 'selected' : ''}`}
            onClick={() => {
              onPlanSelect(plan);
              setError(null);
            }}
          >
            <h3>{plan.name}</h3>
            <p className="price">{plan.price}</p>
            <ul className="features">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button className="select-btn">
              {selectedPlanId === plan.id ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
      
      {selectedPlanId && (
        <div className="proceed-container">
          {!stripeLoaded ? (
            <div className="loading-payment">
              <span className="spinner"></span> Initializing payment system...
            </div>
          ) : stripe ? (
            <>
              <button 
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className="proceed-btn"
              >
                {isProcessing ? (
                  <>
                    <span className="spinner"></span> Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
              <p className="secure-payment-note">
                <i className="lock-icon">🔒</i> Secure payment powered by Stripe
              </p>
            </>
          ) : (
            <div className="payment-error">
              Payment system unavailable. Please refresh the page.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentPlans;