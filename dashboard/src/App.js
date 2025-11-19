import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from './components/Login';
import ProductList from './components/ProductList';
import CreateProduct from './components/CreateProduct';
import Header from './components/Header';
import Footer from './components/Footer';
import { Box, CssBaseline, CircularProgress } from '@mui/material';
import EditProduct from './components/EditProduct';   // <-- new import

function App() {
  const [token, setToken] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);   // ← new flag

  // Load token from cookie on first render
  useEffect(() => {
    const saved = Cookies.get('token');
    if (saved) setToken(saved);
    setCheckingAuth(false);               // ← we’re done checking
  }, []);

  // While we’re still checking the cookie, show a spinner
  if (checkingAuth) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <CssBaseline />
      {/* Header only when logged in */}
      {token && <Header token={token} setToken={setToken} />}

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route
            path="/products"
            element={token ? <ProductList /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/products/create"
            element={token ? <CreateProduct /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/products/:id/edit"
            element={token ? <EditProduct /> : <Navigate to="/login" replace />}
          />
          {/* Root – decide where to go based on auth state */}
          <Route
            path="/"
            element={<Navigate to={token ? '/products' : '/login'} replace />}
          />
        </Routes>
      </Box>

      {/* Footer only when logged in */}
      {token && <Footer />}
    </Router>
  );
}

export default App;