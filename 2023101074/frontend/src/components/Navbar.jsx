import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <Link to='/' className='logo'>Buy-Sell-Rent</Link>
        <div className='nav-links'>
          <Link to='/search'>Search</Link>
          <Link to='/orders'>Orders</Link>
          {/* <Link to='/profile'>Profile</Link> */}
            <Link to='/cart'>Cart</Link>
          {user ? (
            <button onClick={handleLogout} className='logout-btn'>Logout</button>
          ) : (
            <>
              <Link to='/login'>Login</Link>
              <Link to='/register'>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
