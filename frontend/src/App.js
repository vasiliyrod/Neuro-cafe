import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import ItemList from './pages/ItemList/ItemList';
import ItemDetail from './pages/ItemDetail/ItemDetail';
import OrderPage from './pages/OrderPage/OrderPage';
import StartPage from './pages/StartPage/StartPage';
import ChatAIPage from './pages/ChatAI/ChatAI';
import AboutCafe from './pages/AboutCafe/AboutCafe';
import OrderConfirmationPage from './pages/OrderConfirmationPage/OrderConfirmationPage';

//import styles from './App.module.css';
import Navbar from './components/Nav/Navbar';

import { OrderProvider } from './context/OrderContext';
import { EditOrderProvider } from './context/EditOrderContext';
import { OrganisationProvider } from './context/OrganisationContext';

const App = () => {
  const [orderItems, setOrderItems] = useState([]);

  const addToOrder = (item) => {
    const existingItem = orderItems.find((orderItem) => orderItem.id === item.id);
    if (existingItem) {
      updateQuantity(orderItems.indexOf(existingItem), existingItem.quantity + 1);
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeFromOrder(index);
    } else {
      const newOrderItems = [...orderItems];
      newOrderItems[index].quantity = newQuantity;
      setOrderItems(newOrderItems);
    }
  };

  const removeFromOrder = (index) => {
    const newOrderItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newOrderItems);
  };

  return (
  <OrganisationProvider>
      <EditOrderProvider>
            <OrderProvider>
                <Router>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<StartPage />} />
                    <Route path="/chat" element={<ChatAIPage />} />
                    <Route path="/menu" element={<ItemList addToOrder={addToOrder} />} />
                    <Route path="/item/:id" element={<ItemDetail />} />
                    <Route path="/order" element={<OrderPage />} />
                    <Route path="/about_cafe" element={<AboutCafe />} />
                    <Route path="/confirmation" element={<OrderConfirmationPage />} />
                  </Routes>
                </Router>
            </OrderProvider>
      </EditOrderProvider>
  </OrganisationProvider>
  );
};

export default App;