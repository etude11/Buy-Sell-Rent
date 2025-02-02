import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchItemById } from '../api/api';
import { CartContext } from '../context/CartContext';
import { Typography, Button, Chip, Box, Paper, Divider } from '@mui/material';
import { PageContainer } from '../components/FormStyles';

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadItem = async () => {
      try {
        const { data } = await fetchItemById(id, token);
        setItem(data);
      } catch (error) {
        console.error('Error fetching item details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, token]);

  const handleAddToCart = async () => {
    try {
      await addToCart(item);
      alert('Item added to cart successfully!');
    } catch (error) {
      alert('Failed to add item to cart');
    }
  };

  if (loading) return <PageContainer><Typography>Loading...</Typography></PageContainer>;
  if (!item) return <PageContainer><Typography color="error">Item not found</Typography></PageContainer>;

  return (
    <PageContainer>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, width: '100%' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {item.name}
          </Typography>
          <Chip 
            label={item.category}
            color="primary"
            sx={{ mb: 2 }}
          />
          <Typography variant="h5" color="primary" gutterBottom>
            ₹{item.price}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Description</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {item.description || 'No description available'}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Seller Information</Typography>
          <Typography variant="body1">
            {item.seller.firstName} {item.seller.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: {item.seller.email}
          </Typography>
          {item.seller.contactNumber && (
            <Typography variant="body2" color="text.secondary">
              Contact: {item.seller.contactNumber}
            </Typography>
          )}
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          fullWidth
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </Paper>
    </PageContainer>
  );
}

export default ItemDetails;