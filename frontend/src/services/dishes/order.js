import config from '@/config/config';

import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = `http://${config.apiHost}:${config.apiPort}/api/v1`;
const userID = Cookies.get('UID');

export const fetchOrder = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: {
        [config.authHeader]: config.accessToken,
        [config.userIDheader]: userID,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();

    console.log('Ответ сервера о заказу:', data);

    if (!Array.isArray(data)) {
      throw new Error('Некорректный формат данных: ожидался массив');
    }

    const result = data.flatMap((order) => {
      if (!order || typeof order !== 'object' || !order.dishes || !Array.isArray(order.dishes)) {
        console.warn('Некорректный формат данных в элементе массива:', order);
        return [];
      }

      return order.dishes.map((item) => ({
        id: item.dish.id,
        quantity: item.count,
        name: item.dish.name,
        cost: item.dish.cost,
        img_link: item.dish.img_link,
        weight: item.dish.weight,
      }));
    });

    return result;
  } catch (error) {
    console.error('Ошибка при загрузке заказа:', error);
    throw error;
  }
};


export const updateQuantity = async (id, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'PATCH',
      headers: {
          [config.authHeader]: config.accessToken,
          [config.userIDheader]: userID,
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({ count: Number(quantity), dish_id: Number(id)}),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ошибка сервера: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error('Ошибка при обновлении количества:', error);
    throw error;
  }
};


export const removeFromOrder = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'PATCH',
      headers: {
          [config.authHeader]: config.accessToken,
          [config.userIDheader]: userID,
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({ count: Number(-1), dish_id: Number(id)}),
    });
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Ошибка при удалении блюда:', error);
    throw error;
  }
};


export const addToOrder = async (dish) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'PATCH',
      headers: {
          [config.authHeader]: config.accessToken,
          [config.userIDheader]: userID,
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({ count: Number(1), dish_id: Number(dish.id)}),
    });
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Ошибка при добавлении блюда:', error);
    throw error;
  }
};


export const confirmOrder = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/in_progress`, {
      method: 'POST',
      headers: {
          [config.authHeader]: config.accessToken,
          [config.userIDheader]: userID,
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({ status: 'заказ заказан' }),
    });

    if (!response.ok) {
      throw new Error('Ошибка при отправке данных');
    }

    return response.json();
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};


export const OrderCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/count`,
    {
        headers: {
          [config.authHeader]: config.accessToken,
          [config.userIDheader]: userID,
          'Content-Type': 'application/json'
        }
    }
    );

    if (response.status !== 200) {
      throw new Error('Ошибка при загрузке данных OrderCount');
    }

    console.log('Order cOunt', response.data);

    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке количества блюд servic:', error);
    throw error;
  }
};