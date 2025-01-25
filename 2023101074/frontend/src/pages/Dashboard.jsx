import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className='dashboard-container'>
      <h2>Welcome, {user?.firstName}!</h2>
      <div className='dashboard-sections'>
        <div className='section'>
          <h3>Seller Section</h3>
          <Link to='/your-products'>Your Products</Link>
          <Link to='/deliver-items'>Deliver Items</Link>
        </div>
        <div className='section'>
          <h3>Buyer Section</h3>
          <Link to='/search-items'>Search Items</Link>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;