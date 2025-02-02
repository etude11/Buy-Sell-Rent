import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { fetchProfile, updateProfile } from '../api/api';
import './Dashboard.css';

function Dashboard() {
  const { token } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    contactNumber: '',
  });
  const [password, setPassword] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      if (!token) return;
      
      try {
        const response = await fetchProfile(token);
        setProfile(response.data);
        
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    getProfile();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...profile };
      if (password) {
        updateData.password = password;
      }
      await updateProfile(updateData, token);
      setIsEditing(false);
      setPassword('');
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className='dashboard-container'>
      <h2>Profile</h2>
      <div className='profile-details'>
        {!isEditing ? (
          <>
            <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Age:</strong> {profile.age}</p>
            <p><strong>Contact:</strong> {profile.contactNumber}</p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </>
        ) : (
          <form onSubmit={handleUpdate}>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({...profile, firstName: e.target.value})}
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({...profile, lastName: e.target.value})}
              />
            </div>
            <div>
              <label>Contact Number:</label>
              <input
                type="text"
                value={profile.contactNumber}
                onChange={(e) => setProfile({...profile, contactNumber: e.target.value})}
              />
            </div>
            <div>
              <label>New Password (optional):</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Dashboard;