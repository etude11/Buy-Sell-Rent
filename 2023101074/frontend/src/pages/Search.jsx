import { useState, useEffect, useContext } from 'react';
import { fetchProducts } from '../api/api';
import AuthContext from '../context/AuthContext';
import ItemCard from "../components/ItemCard";
import './Search.css';
import { PageContainer } from '../components/FormStyles';
import { TextField, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Search() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

    useEffect(() => {
      const loadProducts = async () => {
        if (!user || !token) {
          
          return;
        }
        try {
          const { data } = await fetchProducts(token);
          const availableProducts = data.filter(product => 
            product.seller._id !== user._id && // Not current user's items
            product.status === 'available' // Only available items
          );
          setProducts(availableProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
  
      loadProducts();
    }, [user, token]);
  
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAddToCart = (e, item) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    addToCart(item);
    window.location.reload();
  };

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>Search Items</Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        helperText="Search by name, description, or category"
      />
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', // Slightly wider cards
        gap: 3,
        width: '100%'
      }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Box 
              key={product._id} 
              onClick={() => handleItemClick(product._id)}
              sx={{ cursor: 'pointer' }}
            >
              <ItemCard 
                item={product} 
                onAddToCart={(e) => handleAddToCart(e, product)}
              />
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No products found matching your search.
          </Typography>
        )}
      </Box>
    </PageContainer>
  );
}

export default Search;