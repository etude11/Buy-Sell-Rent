import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile";
import YourProducts from './pages/YourProducts';
import Search from "./pages/Search";
import Orders from "./pages/Orders";
import ItemDetails from "./pages/ItemDetails";
import DeliverItems from "./pages/DeliverItems";
import Cart from "./pages/Cart";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/orders" element={<Orders />} />
        <Route path='/your-products' element={<YourProducts />} />
        <Route path='/deliver-items' element={<DeliverItems />} />
        <Route path="/item/:id" element={<ItemDetails />} />
      </Routes>
    </>
  );
}

export default App;
