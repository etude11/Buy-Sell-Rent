import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api/api';
import './Login.css';
import { TextField, Button, Typography, Divider } from '@mui/material';
import { FormContainer, FormWrapper } from '../components/FormStyles';

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
    <FormContainer elevation={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <FormWrapper component="form" onSubmit={handleManualLogin}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
        >
          Login
        </Button>
        <Divider>OR</Divider>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleCasLogin}
          size="large"
        >
          Login with CAS
        </Button>
      </FormWrapper>
    </FormContainer>
  );
};

export default Login;