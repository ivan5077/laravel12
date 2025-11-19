import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import {
  getProducts,
  bulkDeleteProducts,
  exportProducts,
  getCategories,
} from '../api/productApi';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category_id: '',
    status: '',
    search: '',
    page: 1,
    per_page: 10,
  });

  const navigate = useNavigate();

  // Load categories once
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Categories error', err));
  }, []);

  // Load products whenever filters change
  useEffect(() => {
    getProducts(filters)
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error('Products error', err));
  }, [filters]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(products.map((p) => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!selected.length) return;
    if (!window.confirm('Delete selected products?')) return;

    try {
      await bulkDeleteProducts(selected);
      setFilters({ ...filters });
      setSelected([]);
    } catch (err) {
      console.error('Bulk delete failed', err);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportProducts(filters);
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products_export.xlsx');
      
      // Append to body, click, and cleanup
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
    } catch (err) {
      console.error('Export failed', err);
      // Optional: Show error to user
      alert('Export failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (id) => {
    navigate(`/products/${id}/edit`);
  };

  const isAllSelected = products.length && selected.length === products.length;

  return (
    <Box>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(selected.length > 0 && {
            bgcolor: (theme) => theme.palette.action.hover,
          }),
        }}
      >
        {selected.length > 0 ? (
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">
            {selected.length} selected
          </Typography>
        ) : (
          <Typography sx={{ flex: '1 1 100%' }} variant="h6">
            Products
          </Typography>
        )}

        {selected.length > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={handleBulkDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Export">
            <IconButton onClick={handleExport}>
              <GetAppIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="filter-category-label">Category</InputLabel>
          <Select
            labelId="filter-category-label"
            value={filters.category_id}
            label="Category"
            onChange={(e) =>
              setFilters({ ...filters, category_id: e.target.value, page: 1 })
            }
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="filter-status-label">Status</InputLabel>
          <Select
            labelId="filter-status-label"
            value={filters.status}
            label="Status"
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value, page: 1 })
            }
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="enabled">Enabled</MenuItem>
            <MenuItem value="disabled">Disabled</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Search"
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value, page: 1 })
          }
        />
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selected.length > 0 && !isAllSelected}
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Enabled</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id} hover selected={selected.includes(p.id)}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.includes(p.id)}
                  onChange={() => handleSelectOne(p.id)}
                />
              </TableCell>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.category?.name ?? p.category_id}</TableCell>
              <TableCell>${p.price}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>{p.enabled ? 'Yes' : 'No'}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => handleEdit(p.id)} title="Edit">
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ProductList;