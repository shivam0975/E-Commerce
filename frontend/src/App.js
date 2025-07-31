import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { StoreProvider } from './context/Store';
import Header from './components/Header';
import Footer from './components/Footer';

import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';

import AdminProductListScreen from './screens/AdminProductListScreen';
import AdminProductEditScreen from './screens/AdminProductEditScreen';
import AdminOrderListScreen from './screens/AdminOrderListScreen';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Header />
          <main className="py-3" style={{ minHeight: '84.8vh' }}>
            <Container fluid>
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/product/:id" element={<ProductScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/shipping" element={<ShippingScreen />} />
                  <Route path="/payment" element={<PaymentScreen />} />
                  <Route path="/placeorder" element={<PlaceOrderScreen />} />
                  <Route path="/order/:id" element={<OrderScreen />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="/admin/products" element={<AdminProductListScreen />} />
                  <Route path="/admin/product/:id/edit" element={<AdminProductEditScreen />} />
                  <Route path="/admin/orders" element={<AdminOrderListScreen />} />
                </Route>
              </Routes>
            </Container>
          </main>
        <Footer />
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;