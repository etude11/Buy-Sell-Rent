import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import YourProducts from './pages/YourProducts';
import Search from "./pages/Search";
import Orders from "./pages/Orders";
import ItemDetails from "./pages/ItemDetails";
import DeliverItems from "./pages/DeliverItems";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import ManualRegister from "./pages/ManualRegister";
import ChatSupport from "./components/ChatSupport";
import { useEffect } from "react";
import { Container, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

function App() {
  useEffect(() => {
    // Check for token in URL hash
    const hash = window.location.hash;
    if (hash && hash.includes('token=')) {
      const token = hash.split('token=')[1];
      localStorage.setItem('token', token);
      window.location.hash = ''; // Clear the hash
      window.location.reload(); // Reload to update auth state
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, pt: 10 }}>
          <Container 
            maxWidth="lg" 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              '& > *': {
                width: '100%',
                maxWidth: '800px',
                mx: 'auto',
                my: 2
              }
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/manual-register" element={<ManualRegister />} />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path='/your-products' element={
                <ProtectedRoute>
                  <YourProducts />
                </ProtectedRoute>
              } />
              <Route path='/deliver-items' element={
                <ProtectedRoute>
                  <DeliverItems />
                </ProtectedRoute>
              } />
              <Route path="/item/:id" element={
                <ProtectedRoute>
                  <ItemDetails />
                </ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute>
                  <ChatSupport />
                </ProtectedRoute>
              } />
            </Routes>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
