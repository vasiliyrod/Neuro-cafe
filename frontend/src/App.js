import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ItemList from './pages/ItemList/ItemList';
import ItemDetail from './pages/ItemDetail/ItemDetail';
import OrderPage from './pages/OrderPage/OrderPage';
import StartPage from './pages/StartPage/StartPage';
import ChatAIPage from './pages/ChatAI/ChatAI';
import AboutCafe from './pages/AboutCafe/AboutCafe';
import OrderConfirmationPage from './pages/OrderConfirmationPage/OrderConfirmationPage';
import OrderDone from './pages/OrderDone/OrderDone';
import FeedbackPage from './pages/FeedbackPage/FeedbackPage';
//import OrderHistory from './pages/OrderHistory/OrderHistory';

import Navbar from './components/Nav/Navbar';

import { OrderProvider } from './context/OrderContext';
import { EditOrderProvider } from './context/EditOrderContext';
import { OrganisationProvider } from './context/OrganisationContext';

const App = () => {
  return (
    <OrganisationProvider>
      <EditOrderProvider>
        <OrderProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/chat" element={<ChatAIPage />} />
              <Route path="/menu" element={<ItemList />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/about_cafe" element={<AboutCafe />} />
              <Route path="/confirmation" element={<OrderConfirmationPage />} />
              <Route path="/done" element={<OrderDone />} />
              <Route path="/review" element={<FeedbackPage />} />
            </Routes>
          </Router>
        </OrderProvider>
      </EditOrderProvider>
    </OrganisationProvider>
  );
};

export default App;