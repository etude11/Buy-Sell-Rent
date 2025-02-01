import axios from 'axios';


const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Authentication APIs
export const loginUser = (userData) => API.post('/auth/login', userData);
export const registerUser = (userData)=>API.post('/auth/register', userData);

// User APIs
export const fetchProfile = (token) => API.get('/users/profile', {
  headers: { Authorization: `Bearer ${token}` },
});

export const updateProfile = (userData, token) => API.put('/users/profile', userData, {
  headers: { Authorization: `Bearer ${token}` },
});

// Items APIs
export const fetchItems = () => API.get('/items');
export const fetchItemDetails = (id) => API.get(`/items/${id}`);
export const fetchProducts = (token) => API.get('/items', {
  headers: { Authorization: `Bearer ${token}` },
});
export const fetchOrders = (token,userId) => API.get(`/orders/${userId}`, {
  headers: { Authorization: `Bearer ${token}` },
});
export const addProduct = (productData, token) => API.post('/items', productData, {
  headers: { Authorization: `Bearer ${token}` },
});
export const addtocart = (itemId,token,userid)=> API.post('users/cart/add', { itemId ,userid }, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
export const fetchCartItems = (token, userId) => API.get('users/cart', {
  headers: {
    Authorization: `Bearer ${token}`
  },
  params: {
    userId: userId
  }
});
export const completeOrder = (orderId, otp, token) => API.post(`/orders/${orderId}/complete`, { otp }, {
  headers: { Authorization: `Bearer ${token}` },
});
export const placeOrder = (orderData, token, userId) => API.post(`/orders/place/${userId}`, orderData, {
  headers: { Authorization: `Bearer ${token}` },
});

export const getSellerOrders = (token) => API.get('/orders/seller', {
  headers: { Authorization: `Bearer ${token}` },
});

export const completeDelivery = (orderId, otp, token) => API.post(`/orders/${orderId}/complete`, { otp }, {
  headers: { Authorization: `Bearer ${token}` },
});

export const fetchPendingOrders = (token) => API.get('/orders/pending', {
  headers: { Authorization: `Bearer ${token}` },
});

export const fetchBoughtItems = (token) => API.get('/orders/bought', {
  headers: { Authorization: `Bearer ${token}` },
});

export const fetchSoldItems = (token) => API.get('/orders/sold', {
  headers: { Authorization: `Bearer ${token}` },
});

export default API;
