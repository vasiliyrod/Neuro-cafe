import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import ItemList from '@/pages/ItemList/ItemList';
import ItemDetail from '@/pages/ItemDetail/ItemDetail';
import OrderPage from '@/pages/OrderPage/OrderPage';
import StartPage from '@/pages/StartPage/StartPage';
import ChatAIPage from '@/pages/ChatAI/ChatAI';
import AboutCafe from '@/pages/AboutCafe/AboutCafe';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage/OrderConfirmationPage';
import OrderDone from '@/pages/OrderDone/OrderDone';
import FeedbackPage from '@/pages/FeedbackPage/FeedbackPage';
import OrderHistory from '@/pages/OrderHistory/OrderHistory';
import ErrorPage from '@/pages/Errors/Error';
import ErrorLogPage from '@/pages/Errors/ErrorLog';
import Booking from '@/pages/Booking/Booking';

import Navbar from '@/components/Nav/Navbar';
import UserIDChecker from '@/utils/cookie';

import { OrderProvider } from '@/context/OrderContext';
import { EditOrderProvider } from '@/context/EditOrderContext';
import { OrganisationProvider } from '@/context/OrganisationContext';

import styles from '@/App.module.css';

const App = () => {
  const NotFound = () => {
      return (
        <div className={styles.not_found_container}>
          <h1>404</h1>
          <h1>Страница не найдена</h1>
          <p>Извините, запрашиваемая страница не существует.</p>
        </div>
      );
    };

  return (
    <Router>
      <OrganisationProvider>
        <EditOrderProvider>
          <OrderProvider>
            <UserIDChecker>
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
                <Route path="/history" element={<OrderHistory />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="/errorlog" element={<ErrorLogPage />} />
                <Route path="/booking" element={<Booking />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </UserIDChecker>
          </OrderProvider>
        </EditOrderProvider>
      </OrganisationProvider>
    </Router>
  );
};

export default App;