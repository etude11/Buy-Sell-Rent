import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/api';
import './Register.css';
function Register() {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', age: '', contactNumber: '', password: '' });
    const navigate = useNavigate();
  
    const handleRegister = async (e) => {
      e.preventDefault();
      try {
        
        const { data } = await registerUser(formData);
        localStorage.setItem('token', data.token);
        navigate('/');
        window.location.reload();
      } catch (error) {
        // alert('Registration failed!');
      }
    };
  
    return (
      <div className='register-container'>
        <div className='register-box'>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input type='text' placeholder='First Name' className='input-field' value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            <input type='text' placeholder='Last Name' className='input-field' value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            <input type='email' placeholder='Email' className='input-field' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input type='number' placeholder='Age' className='input-field' value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
            <input type='text' placeholder='Contact Number' className='input-field' value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} />
            <input type='password' placeholder='Password' className='input-field' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            <button type='submit' className='submit-btn'>Register</button>
          </form>
        </div>
      </div>
    );
  }
  export default Register;