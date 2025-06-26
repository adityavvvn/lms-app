import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert } from '@mui/material';
import authAxios from '../../utils/authAxios';

function AdminProfile() {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await authAxios.get('/api/auth/me');
        setProfile({ name: res.data.user.name, email: res.data.user.email });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const updateData = { name: profile.name };
      if (password) updateData.password = password;
      await authAxios.put('/api/auth/me', updateData);
      setSuccess('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, letterSpacing: 1.1 }}>
          Admin Profile
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="New Password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            type="password"
            helperText="Leave blank to keep current password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3, fontWeight: 500, borderRadius: 2 }}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Saving...' : 'Update Profile'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdminProfile; 