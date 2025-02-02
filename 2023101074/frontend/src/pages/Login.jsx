import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
      window.location.reload();
    }
  }, [location, navigate]);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser(formData);
      localStorage.setItem('token', data.token);
      navigate('/');
      window.location.reload();
    } catch (error) {
      alert('Login failed!');
    }
  };

  const handleCasLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/cas/login';
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleManualLogin}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="input-field"
          />
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <div className="divider">OR</div>
        <button onClick={handleCasLogin} className="cas-btn">
          Login with CAS
        </button>
        <p className="register-link">
          Don't have an account? <a href="/manual-register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;