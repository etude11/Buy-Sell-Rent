import { useEffect, useState, useContext } from 'react';
import { fetchProducts, addProduct } from '../api/api';
import AuthContext from '../context/AuthContext';
import './YourProducts.css';


function YourProducts() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: '' });
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('token');
    
    useEffect(() => {
      const loadProducts = async () => {
        if (!user || !token) {
          console.log('User or token not available, skipping fetch');
          return; // Skip fetching if user or token is not available
        }
    
        try {
          console.log('Fetching products for user:', user._id);
          const { data } = await fetchProducts(token);
          console.log('Fetched products:', data);
          const userProducts = data.filter((product) => product.seller._id === user._id);
          setProducts(userProducts);
          console.log('Filtered products:', userProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
    
      loadProducts();
    }, [user, token]);
    
    const handleAddProduct = async (e) => {
      e.preventDefault();
      if (!user) {
        alert('User is not defined');
        return;
      }
      try {
        const productData = { ...newProduct, seller: user._id };
        await addProduct(productData, token);
        alert('Product added successfully!');
        setNewProduct({ name: '', price: '', description: '', category: '' });
        setProducts([...products, productData]);
      } catch (error) {
        alert('Failed to add product');
      }
    };
  return (
    <div className='your-products-container'>
      <h2>Your Products</h2>
      <form onSubmit={handleAddProduct}>
        <input type='text' placeholder='Name' value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
        <input type='number' placeholder='Price' value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
        <input type='text' placeholder='Description' value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
        <input type='text' placeholder='Category' value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} required />
        <button type='submit'>Add Product</button>
      </form>
      <ul>
        {products.map((product) => (
          <li key={product._id}>{product.name} - ₹{product.price}</li>
        ))}
      </ul>
    </div>
  );
}
export default YourProducts;