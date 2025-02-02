import { useState, useEffect, useContext } from 'react';
import { fetchProducts } from '../api/api';
import AuthContext from '../context/AuthContext';
import ItemCard from "../components/ItemCard";
import './Search.css';
import { PageContainer } from '../components/FormStyles';
import { TextField, Box } from '@mui/material';

function Search() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');

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

  const handleAddToCart = (item) => {
    addToCart(item);
    window.location.reload();
  };

  return (
    <PageContainer>
      <h2>Search Items</h2>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 3,
        width: '100%'
      }}>
        {filteredProducts.map((product) => (
          <ItemCard 
            key={product._id} 
            item={product} 
            onAddToCart={handleAddToCart}
          />
        ))}
      </Box>
    </PageContainer>
  );
}

export default Search;