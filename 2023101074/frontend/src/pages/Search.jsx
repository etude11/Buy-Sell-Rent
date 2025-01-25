import { useState, useEffect, useContext } from 'react';
import { fetchProducts } from '../api/api';
import AuthContext from '../context/AuthContext';
import ItemCard from "../components/ItemCard";
import './Search.css';

function Search() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadProducts = async () => {
      if (!user || !token) {
        console.log('User or token not available, skipping fetch');
        return;
      }
      try {
        const { data } = await fetchProducts(token);
        const otherProducts = user 
          ? data.filter((product) => product.seller._id !== user._id)
          : data;
        setProducts(otherProducts);
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

  return (
    <div className='search-container'>
      <h2>Search Items</h2>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ItemCard key={product._id} item={product} />
        ))}
      </div>
    </div>
  );
}

export default Search;