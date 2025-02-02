import React, { useContext } from "react";
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { CartContext } from "../context/CartContext";

const ItemCard = ({ item, onAddToCart }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      '&:hover': {
        transform: 'scale(1.02)',
        transition: 'transform 0.2s ease-in-out',
        boxShadow: 3
      }
    }}>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          {item.name}
        </Typography>
        <Typography variant="body1" color="text.primary" gutterBottom>
          ₹{item.price}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {item.description || 'No description available'}
        </Typography>
        <Chip 
          label={item.category} 
          size="small" 
          color="info"
          sx={{ mb: 2 }}
        />
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={onAddToCart}
        >
          Add to Cart
        </Button>
      </Box>
    </Card>
  );
};

export default ItemCard;
