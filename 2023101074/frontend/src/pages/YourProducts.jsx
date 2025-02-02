import { useEffect, useState, useContext } from 'react';
import { fetchProducts, addProduct } from '../api/api';
import AuthContext from '../context/AuthContext';
import { Typography, TextField, Box, MenuItem, Card, Chip } from '@mui/material';
import { PageContainer, FormContainer, FormWrapper } from '../components/FormStyles';

const CATEGORIES = ['Grocery', 'Electronics', 'Books', 'Misc'];

function YourProducts() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '' });
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('token');
    
    useEffect(() => {
      const loadProducts = async () => {
        if (!user || !token) {
          
          return; // Skip fetching if user or token is not available
        }
    
        try {
          
          const { data } = await fetchProducts(token);
          
          const userProducts = data.filter((product) => product.seller._id === user._id);
          setProducts(userProducts);
          
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
    
      loadProducts();
    }, [user, token]);
    
    const handleAddProduct = async (e) => {
      e.preventDefault();
      if (!user) {
        // alert('User is not defined');
        return;
      }
      try {
        const productData = { ...newProduct, seller: user._id };
        await addProduct(productData, token);
        // alert('Product added successfully!');
        setNewProduct({ name: '', price: '', description: '', category: '' });
        setProducts([...products, productData]);
      } catch (error) {
        // alert('Failed to add product');
      }
    };
  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>Your Products</Typography>
      <FormContainer>
        <FormWrapper component="form" onSubmit={handleAddProduct}>
          <TextField
            fullWidth
            label="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <TextField
            fullWidth
            label="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <TextField
            select
            fullWidth
            label="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          >
            {CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <button type='submit'>Add Product</button>
        </FormWrapper>
      </FormContainer>
      <Box sx={{ mt: 4, width: '100%' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
          {products.map((product) => (
            <Card key={product._id} sx={{ p: 2 }}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body1" color="primary">₹{product.price}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {product.description}
              </Typography>
              <Chip 
                label={product.category} 
                size="small" 
                color="info" 
                sx={{ mt: 1 }}
              />
            </Card>
          ))}
        </Box>
      </Box>
    </PageContainer>
  );
}
export default YourProducts;