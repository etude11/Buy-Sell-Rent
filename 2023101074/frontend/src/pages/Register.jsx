import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from '../api/api';
import './Register.css';
import { FormContainer, FormWrapper } from '../components/FormStyles';
import { Typography, TextField } from '@mui/material';

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    contactNumber: '',
    email: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, [location]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await registerUser({ ...formData, isCasUser: true });
      localStorage.setItem('token', data.token);
      navigate('/');
      window.location.reload();
    } catch (error) {
      alert('Registration failed!');
    }
  };

  return (
    <FormContainer elevation={3}>
      <Typography variant="h4" gutterBottom>Complete Your Profile</Typography>
      <FormWrapper component="form" onSubmit={handleRegister}>
        <TextField
          fullWidth
          label="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        <TextField
          fullWidth
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        <TextField
          fullWidth
          label="Age"
          type="number"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        />
        <TextField
          fullWidth
          label="Contact Number"
          value={formData.contactNumber}
          onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
        />
        <button type='submit' className='submit-btn'>Complete Registration</button>
      </FormWrapper>
    </FormContainer>
  );
}

export default Register;