import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8001';


export const fetchDishes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dishes`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    throw error;
  }
};

export const addDishToOrder = async (dishId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/order/add/${dishId}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении блюда в заказ:', error);
    throw error;
  }
};