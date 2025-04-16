import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../utils';
import './Login.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate email before sending request
    if (!email.trim()) {
      return handleError('Please enter a valid email.');
    }

    try {
      const url = 'https://emotion-mood-music.onrender.com/forgot-password/forgot';
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      
      // Check for success property or custom error message from the server
      if (response.ok && data.status === "success") {
        handleSuccess(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Display error message from server (ensure the server sends message consistently)
        handleError(data.message || 'User does not exist.');
      }
    } catch (err) {
      handleError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className='container'>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            name='email'
            placeholder='Enter your email....'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type='Submit'>Send</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;
