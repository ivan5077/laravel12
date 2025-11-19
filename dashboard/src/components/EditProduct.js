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
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct, getCategories } from '../api/productApi';

const EditProduct = () => {
  const { id } = useParams();               // <-- product ID from URL
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);   // page‑load spinner
  const [saving, setSaving] = useState(false);    // submit spinner
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    stock: '',
    enabled: true,
  });

  // ------------------------------------------------------------------
  // Load categories (for the dropdown) and the product data
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategories(),
          getProduct(id),
        ]);

        setCategories(catRes.data);
        const p = prodRes.data;   // Laravel returns the model as `data`
        setForm({
          name: p.name,
          category_id: p.category_id,
          description: p.description ?? '',
          price: p.price,
          stock: p.stock,
          enabled: p.enabled,
        });
      } catch (err) {
        setError('Failed to load product or categories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ------------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await updateProduct(id, {
        name: form.name,
        category_id: form.category_id,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        enabled: form.enabled,
      });

      // After a successful update, go back to the list
      navigate('/products');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to update product. Please check the data.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------------------
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit Product
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
            disabled={saving}
            sx={{ mt: 2 }}
          >
            {saving ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditProduct;