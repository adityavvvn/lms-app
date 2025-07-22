import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import logo from '../logo.svg'; // Use your logo or update path

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', minHeight: 72 }}>
        {/* Logo and Tagline */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src={logo} alt="ASTRON Learning" style={{ height: 40 }} />
          <Box>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold',
                letterSpacing: 1.2,
                fontSize: 22,
              }}
            >
              ASTRON <span style={{ fontWeight: 400 }}>Learning</span>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 12, ml: 0.5 }}>
              FINANCIAL ADVISORS Management System
            </Typography>
          </Box>
        </Box>
        {/* Center Menu */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button component={RouterLink} to="#features" color="inherit" sx={{ fontWeight: 500, fontSize: 16 }}>
            Features
          </Button>
          <Button component={RouterLink} to="#pricing" color="inherit" sx={{ fontWeight: 500, fontSize: 16 }}>
            Pricing
          </Button>
          <Button component={RouterLink} to="#blog" color="inherit" sx={{ fontWeight: 500, fontSize: 16 }}>
            Blog
          </Button>
          <Button component={RouterLink} to="#docs" color="inherit" sx={{ fontWeight: 500, fontSize: 16 }}>
            Documentation
          </Button>
          {/* Student-specific center menu */}
          {user && user.role === 'student' && (
            <>
              <Button component={RouterLink} to="/student/dashboard" color="inherit" sx={{ fontWeight: 500, fontSize: 16 }}>
                My Courses
              </Button>
              <Button component={RouterLink} to="/courses" color="inherit" sx={{ fontWeight: 500, fontSize: 16 }}>
                Browse Courses
              </Button>
            </>
          )}
          {/* Admin-specific center menu */}
          {user && user.role === 'admin' && (
            <>
              <Button component={RouterLink} to="/admin/dashboard" color="inherit" sx={{ fontWeight: 500, fontSize: 16 }}>
                Admin Dashboard
              </Button>
              <Button component={RouterLink} to="/admin/dashboard" color="inherit" sx={{ fontWeight: 500, fontSize: 16 }}>
                User Management
              </Button>
            </>
          )}
        </Box>
        {/* Right Side: Auth Buttons & Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user && user.role === 'student' && (
            <>
              <Button component={RouterLink} to="/student/dashboard" variant="outlined" color="inherit" sx={{ fontWeight: 500, borderRadius: 3, mr: 1 }}>
                My Courses
              </Button>
              <Button component={RouterLink} to="/courses" variant="outlined" color="inherit" sx={{ fontWeight: 500, borderRadius: 3, mr: 1 }}>
                Browse Courses
              </Button>
            </>
          )}
          {/* Admin-specific right menu */}
          {/* Removed duplicate Admin Dashboard and User Management buttons for admin here */}
          {!user ? (
            <>
              <Button
                variant="contained"
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ fontWeight: 500, borderRadius: 3, mr: 1, bgcolor: '#111', color: '#fff', '&:hover': { bgcolor: '#222' } }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{ fontWeight: 500, borderRadius: 3, bgcolor: '#fff', color: '#111', borderColor: '#111', '&:hover': { bgcolor: '#f5f5f5' } }}
              >
                Register
              </Button>
            </>
          ) : (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user.image ? (
                  <Avatar
                    src={user.image}
                    alt={user.name}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 