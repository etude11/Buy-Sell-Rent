import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { fetchProfile, updateProfile } from '../api/api';
import { Typography, TextField, Button, Box } from '@mui/material';
import { PageContainer, FormContainer, FormWrapper } from '../components/FormStyles';

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
    <PageContainer>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <FormContainer>
        {!isEditing ? (
          <Box sx={{ width: '100%', p: 2 }}>
            <Typography><strong>Name:</strong> {profile.firstName} {profile.lastName}</Typography>
            <Typography><strong>Email:</strong> {profile.email}</Typography>
            <Typography><strong>Age:</strong> {profile.age}</Typography>
            <Typography><strong>Contact:</strong> {profile.contactNumber}</Typography>
            <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>
              Edit Profile
            </Button>
          </Box>
        ) : (
          <FormWrapper component="form" onSubmit={handleUpdate}>
            <TextField
              fullWidth
              label="First Name"
              value={profile.firstName}
              onChange={(e) => setProfile({...profile, firstName: e.target.value})}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={profile.lastName}
              onChange={(e) => setProfile({...profile, lastName: e.target.value})}
            />
            <TextField
              fullWidth
              label="Contact Number"
              value={profile.contactNumber}
              onChange={(e) => setProfile({...profile, contactNumber: e.target.value})}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button type="submit" variant="contained">Save Changes</Button>
              <Button variant="outlined" onClick={() => setIsEditing(false)}>Cancel</Button>
            </Box>
          </FormWrapper>
        )}
      </FormContainer>
    </PageContainer>
  );
}

export default Dashboard;