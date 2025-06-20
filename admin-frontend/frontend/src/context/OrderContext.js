import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderCount, setOrderCount] = useState(0);

  const fetchOrderCount = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8001/order/count');
      setOrderCount(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке количества блюд:', error);
    }
  };

  useEffect(() => {
    fetchOrderCount();
  }, []);

  const updateOrderCount = () => {
    fetchOrderCount();
  };

  return (
    <OrderContext.Provider value={{ orderCount, updateOrderCount }}>
      {children}
    </OrderContext.Provider>
  );
};