import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      py: 2,
      px: 1,
      mt: 'auto',
      backgroundColor: (theme) =>
        theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
    }}
  >
    <Container maxWidth="lg">
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} Laravel 12 Admin Dashboard. All rights reserved.
      </Typography>
    </Container>
  </Box>
);

export default Footer;