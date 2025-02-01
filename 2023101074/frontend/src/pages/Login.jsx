import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ email, password });
      localStorage.setItem('token', data.token);
      navigate('/');
      window.location.reload();
    } catch (error) {
      alert('Invalid credentials!');
    }
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type='email' placeholder='Email' className='input-field' value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type='password' placeholder='Password' className='input-field' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type='submit' className='submit-btn'>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
