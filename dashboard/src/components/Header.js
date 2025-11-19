import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Header = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('token');
    setToken('');
    navigate('/login');
  };

  const goToCreate = () => {
    navigate('/products/create');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>

        {/* Show “Create Product” only when logged in */}
        {token && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" onClick={goToCreate}>
              Create Product
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;