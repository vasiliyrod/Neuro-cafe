import React, { createContext, useState, useEffect } from 'react';

export const EditOrderContext = createContext();

export const EditOrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);


  // Функция для получения заказа с сервера
  const fetchOrder = async () => {
      try {
        const response = await fetch('http://localhost:8001/order');
        console.log('Ответ сервера:', response);

        if (response.ok) {
          const data = await response.json();
          console.log('Данные от сервера:', data);

          if (!Array.isArray(data)) {
            console.error('Некорректный формат данных: ожидался массив', data);
            return;
          }

          const items = data.map((item) => ({
            id: item.dish.id,
            quantity: item.quantity,
            name: item.dish.name,
            cost: item.dish.cost,
            weight: item.dish.weight,
          }));

          setOrderItems(items);
        } else {
          console.error('Ошибка сервера:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Ошибка при загрузке заказа:', error);
      }
    };

  // Функция для обновления количества блюда в заказе
  const updateQuantity = async (id, quantity) => {
      if (quantity < 1) {
        await removeFromOrder(id);
      } else {
        try {
          const response = await fetch(`http://localhost:8001/order/update/${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: Number(quantity) }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка сервера:', errorData);
            throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
          }

          fetchOrder();
        } catch (error) {
          console.error('Ошибка при обновлении количества:', error);
        }
      }
    };

  // Функция для удаления блюда из заказа
  const removeFromOrder = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/order/remove/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchOrder();
      }
    } catch (error) {
      console.error('Ошибка при удалении блюда:', error);
    }
  };

  // Функция для добавления блюда в заказ
  const addToOrder = async (dish) => {
    try {
      const response = await fetch(`http://localhost:8001/order/add/${dish.id}`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchOrder();
      }
    } catch (error) {
      console.error('Ошибка при добавлении блюда:', error);
    }
  };

  // Обновляем общую стоимость заказа
  useEffect(() => {
    const calculateTotal = () => {
      const newTotal = orderItems.reduce((sum, item) => sum + (item.cost * item.quantity || 0), 0);
      setTotal(newTotal);
    };
    calculateTotal();
  }, [orderItems]);

  // Загружаем заказ при первом рендере
  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <EditOrderContext.Provider value={{ orderItems, total, updateQuantity, removeFromOrder, addToOrder }}>
      {children}
    </EditOrderContext.Provider>
  );
};