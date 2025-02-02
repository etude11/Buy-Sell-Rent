import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from '../api/api';
import './Register.css';

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
    <div className='register-container'>
      <div className='register-box'>
        <h2>Complete Your Profile</h2>
        <form onSubmit={handleRegister}>
          <input type='text' placeholder='First Name' className='input-field' 
            value={formData.firstName} 
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
          <input type='text' placeholder='Last Name' className='input-field' 
            value={formData.lastName} 
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
          <input type='number' placeholder='Age' className='input-field' 
            value={formData.age} 
            onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
          <input type='text' placeholder='Contact Number' className='input-field' 
            value={formData.contactNumber} 
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} />
          <button type='submit' className='submit-btn'>Complete Registration</button>
        </form>
      </div>
    </div>
  );
}

export default Register;