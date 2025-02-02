import { useEffect, useState, useContext } from 'react';
import { fetchProducts, addProduct } from '../api/api';
import AuthContext from '../context/AuthContext';
import { Typography, TextField, Box } from '@mui/material';
import { PageContainer, FormContainer, FormWrapper } from '../components/FormStyles';

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
            fullWidth
            label="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <button type='submit'>Add Product</button>
        </FormWrapper>
      </FormContainer>
      <Box sx={{ mt: 4, width: '100%' }}>
        <ul>
          {products.map((product) => (
            <li key={product._id}>{product.name} - ₹{product.price}</li>
          ))}
        </ul>
      </Box>
    </PageContainer>
  );
}
export default YourProducts;