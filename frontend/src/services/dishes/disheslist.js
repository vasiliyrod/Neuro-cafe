import axios from 'axios';
import Cookies from 'js-cookie';

import config from '@/config/config';

const userID = Cookies.get('UID');
const API_BASE_URL = `http://${config.apiHost}:${config.apiPort}/api/v1`;


export const fetchDishes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dishes`,
    {
        headers: {
          [config.authHeader]: config.accessToken,
          [config.userIDheader]: userID,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status !== 200) {
      throw new Error('Ошибка при загрузке данных fetchDishes');
    }

    console.log('Ответ сервера по меню:',response.data);

    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке данных блюд:', error);
    throw error;
  }
};

export const addDishToOrder = async (dishId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
          method: 'PATCH',
          headers: {
              [config.authHeader]: config.accessToken,
              [config.userIDheader]: userID,
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({ count: 1, dish_id: Number(dishId)}),
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных addDishToOrder');
        }

      } catch (error) {
        console.error('Ошибка при добавлении блюда  addDishToOrder  :', error);
        throw error;
      }
};