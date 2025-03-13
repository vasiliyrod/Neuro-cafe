import React, { createContext, useState, useEffect } from 'react';
import { OrderCount } from '@/services/dishes/order';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderCount, setOrderCount] = useState(0);

  const loadOrderCount = async () => {
    try {
      const count = await OrderCount();
      setOrderCount(count);
    } catch (error) {
      console.error('Ошибка при загрузке количества блюд:', error);
    }
  };

  useEffect(() => {
    loadOrderCount();
  }, []);

  const updateOrderCount = () => {
    loadOrderCount();
  };

  return (
    <OrderContext.Provider value={{ orderCount, updateOrderCount }}>
      {children}
    </OrderContext.Provider>
  );
};