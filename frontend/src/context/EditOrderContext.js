import React, { createContext, useState, useEffect } from 'react';

import { fetchOrder, updateQuantity, removeFromOrder, addToOrder } from '../services/dishes/order';

export const EditOrderContext = createContext();

export const EditOrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);

  const loadOrder = async () => {
    try {
      const items = await fetchOrder();
      setOrderItems(items);
    } catch (error) {
      console.error('Ошибка при загрузке заказа:', error);
    }
  };

  const handleUpdateQuantity = async (id, quantity) => {
    if (quantity < 1) {
      await handleRemoveFromOrder(id);
    } else {
      try {
        await updateQuantity(id, quantity);
        await loadOrder();
      } catch (error) {
        console.error('Ошибка при обновлении количества:', error);
      }
    }
  };

  const handleRemoveFromOrder = async (id) => {
    try {
      await removeFromOrder(id);
      await loadOrder();
    } catch (error) {
      console.error('Ошибка при удалении блюда:', error);
    }
  };

  const handleAddToOrder = async (dish) => {
    try {
      await addToOrder(dish);
      await loadOrder();
    } catch (error) {
      console.error('Ошибка при добавлении блюда:', error);
    }
  };

  useEffect(() => {
    const calculateTotal = () => {
      const newTotal = orderItems.reduce((sum, item) => sum + (item.cost * item.quantity || 0), 0);
      setTotal(newTotal);
    };
    calculateTotal();
  }, [orderItems]);

  useEffect(() => {
    loadOrder();
  }, []);

  return (
    <EditOrderContext.Provider
      value={{
        orderItems,
        total,
        updateQuantity: handleUpdateQuantity,
        removeFromOrder: handleRemoveFromOrder,
        addToOrder: handleAddToOrder,
      }}
    >
      {children}
    </EditOrderContext.Provider>
  );
};