import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createProduct, getCategories } from '../api/productApi';

const CreateProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    stock: '',
    enabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load categories for the dropdown
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Categories load error', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic client‑side validation
    if (!form.name || !form.category_id) {
      setError('Name and Category are required.');
      setLoading(false);
      return;
    }

    try {
      await createProduct({
        name: form.name,
        category_id: form.category_id,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        enabled: form.enabled,
      });

      // After successful creation, go back to the product list
      navigate('/products');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to create product. Please check the data and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create New Product
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category_id"
              value={form.category_id}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />

          <TextField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ step: '0.01' }}
          />

          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <FormControl margin="normal">
            <InputLabel id="enabled-label">Status</InputLabel>
            <Select
              labelId="enabled-label"
              name="enabled"
              value={form.enabled}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value={true}>Enabled</MenuItem>
              <MenuItem value={false}>Disabled</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Product'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateProduct;