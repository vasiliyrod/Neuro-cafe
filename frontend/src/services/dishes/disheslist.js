import axios from 'axios';
import config from '../../config/config';

const API_BASE_URL = `http://${config.apiHost}:${config.apiPort}`;


export const fetchDishes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dishes`,
    {
        headers: {
          [config.authHeader]: config.accessToken,
          [config.userIDheader]: "123",
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    throw error;
  }
};

export const addDishToOrder = async (dishId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/order/add/${dishId}`,
    {
        headers: {
          [config.authHeader]: config.accessToken,
          [config.userIDheader]: "123",
          'Content-Type': 'application/json'
        }
    }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении блюда в заказ:', error);
    throw error;
  }
};